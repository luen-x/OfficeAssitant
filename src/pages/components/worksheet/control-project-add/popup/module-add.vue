<template>
	<i-modal 
		ref="modal"
		v-model="visible" 
		:loading="true" 
		:mask-closable="false"
		width="450px" 
		class="v-worksheet-project-module-add"
		@on-ok="handleOk"
		@on-close="handleCancel"
	>
		<div slot="header" class="g-tc">
			<span>添加模块</span>
		</div>

		<i-form 
			ref="form" 
			:model="formData" 
			:rules="rules" 
			:label-width="95"
			@submit.native.prevent
		>
			<div v-for="(item, index) in formData.list" :key="item.uid" class="g-flex">
				<div>
					<i-form-item 
						:rules="rules.module_name" 
						:prop="'list.' + index + '.module_name'"
						label="模块名称"
					>
						<i-input 
							v-model="item.module_name"
							:maxlength="10"
							clearabled
							placeholder="请输入模块名称"
							style="width: 220px"
						/>
					</i-form-item>
					<i-form-item 
						:rules="rules.staff_id" 
						:prop="'list.' + index + '.staff_id'"
						label="负责人"
					>
						<i-select
							v-model="item.staff_id"
							label-in-value
							filterable
							remote
							transfer
							clearable
							placeholder="请输入关键字搜索"
							style="width: 220px"
							@on-change="handleChange($event, index)"
						>
							<i-option
								v-for="(it, i) in staff_list"
								:key="i"
								:value="it.staff_id"
							>{{ it.staff_name }}</i-option>
						</i-select>
					</i-form-item>
				</div>
				<div v-if="!inEdit">
					<i 
						v-if="formData.list.length !== 1"
						class="icon iconfont icon-remove-circle g-c-red-mid g-pointer g-m-l-5 g-relative"
						style="top: 5px;"
						@click="handleDel(item, index)"
					/>
					<i 
						v-if="(index === formData.list.length - 1)"
						class="icon iconfont icon-add1 g-c-blue-mid g-pointer g-m-l-5 g-relative" 
						style="top: 5px;"
						@click="handleAdd"
					/>
				</div>
			</div>
		</i-form>
	</i-modal>
</template>

<script>
import { Modal, Input, Button, Form, FormItem, Select, Option } from 'iview';
import { CreatePortal } from 'wya-vc';
import orderModal from '@extends/mixins/orderModal';
import { uid } from '@utils/utils';

export default {
	name: "oa-project-module-add",
	components: {
		'i-modal': Modal,
		'i-input': Input,
		'i-button': Button,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-select': Select,
		'i-option': Option,
	},
	mixins: [orderModal],
	props: {
		systemId: [String, Number], // 项目id
		parentModuleId: [String, Number], // 父级模块id
		parentStaffId: [String, Number], // 父级模块负责人id
		max: Number, // 最多新增数量
		autoSave: Boolean, // 保存时请求接口
		level: String,
		moduleId: [String, Number],
		moduleName: String,
		staffId: Number,
		staffName: String,
		inEdit: {
			type: Boolean,
			default: false
		}
	},
	data() {
		const baseModule = { 
			system_id: this.systemId, 
			p_module_id: this.parentModuleId,
			module_name: '',
			staff_id: this.parentStaffId || '',
			level: this.level
		};
		const editModule = {
			system_id: this.systemId, 
			module_id: this.moduleId,
			module_name: this.moduleName,
			staff_id: this.staffId,
			staff_name: this.staffName,
			level: this.level
		};
		return {
			visible: false,
			baseModule,
			staff_list: [],
			formData: {// 表单
				list: this.inEdit ? [{ ...editModule, uid: uid(), child: [] }] : [{ ...baseModule, uid: uid(), child: [] }]
			},
			rules: {// 表单验证
				module_name: [
					{ required: true, message: '请输入模块名称', trigger: 'blur' },
					{ validator: this.repeatValidator, trigger: 'blur' }
				],
				staff_id: [
					{ required: true, type: 'number', message: '请选择模块负责人', trigger: 'change' }
				]
			},
		};
	},
	mounted() {
		this.visible = true;
		this.loadStaffList();
	},
	methods: {
		/**
		 * 根据被评人姓名搜索
		 */
		loadStaffList() {
			this.$request({
				url: '_WORKSHEET_CONTROL_PROJECT_STAFF_LIST_GET',
				type: 'GET',
				loading: false,
				param: {},
				autoTip: false
			}).then(res => {
				if (Array.isArray(res.data)) {
					this.staff_list = res.data;
				}
			}).catch(error => {
				this.$Message.error(error.msg); 
			});
		},
		handleAdd() {
			if (this.formData.list.length < this.max) {
				this.formData.list.push({ ...this.baseModule, uid: uid(), child: [] });
			} else {
				this.$Message.error("最多添加30个模块");
			}
		},
		handleDel(item, index) {
			this.formData.list.splice(index, 1);
		},
		repeatValidator(rule, value, callback) {
			const len = this.formData.list.filter(it => it.module_name === value).length;
			if (len > 1) {
				callback('模块名称有重复，请重新输入');
			} else {
				callback();
			}
		},
		handleChange({ label, value } = {}, index) {
			this.$set(this.formData.list[index], 'staff_name', label);
		},
		/**
		 * 点击取消
		 */
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		/**
		 * 点击确定
		 */
		handleOk() {
			this.$refs.form.validate(valid => {
				if (valid) {
					if (this.autoSave) {
						this.$request({
							url: '_WORKSHEET_CONTROL_MODULE_ADD_POST',
							type: 'POST',
							loading: false,
							param: this.formData.list,
							autoTip: true
						}).then(async (res) => {
							this.$refs.modal.buttonLoading = false;
							this.visible = false;
							this.$emit('sure', { module_list: this.formData.list });
						}).catch(err => {
							this.$refs.modal.buttonLoading = false;
						});
					} else {
						this.$refs.modal.buttonLoading = false;
						this.visible = false;
						this.$emit('sure', {
							module_list: this.formData.list
						});
					}
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		}
	}
};

export const projectModuleAdd = CreatePortal({}, module.exports.default);

</script>

<style lang="scss">
.v-worksheet-project-module-add {
	.ivu-form .ivu-form-item-label {
		padding-right: 10px;
	}
}
</style>

