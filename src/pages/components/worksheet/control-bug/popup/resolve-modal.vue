<template>
	<div>
		<i-modal
			ref="modal"
			:loading="true"
			v-model="visible"
			:width="680"
			:mask-closable="false"
			:title="is_order == 8 ? '解决' : '验证通过'"
			class="v-worksheet-control-bug-resolve-modal"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<i-form
				ref="form" 
				:model="formData" 
				:label-width="100" 
				:rules="formdataRule" 
				class="g-m-t-20 g-pd-l-10"
				@submit.native.prevent
			>
				<i-form-item 
					label="解决方案：" 
					prop="solve_type"
				>
					<i-select
						v-model="formData.solve_type"
						:disabled="is_order == 6"
						class="g-m-r-5"
						style="width: 300px;"
						clearable
						transfer
						placeholder="请选择解决方案"
					><i-option
						v-for="(v, index) in resolveList"
						:key="index"
						:value="v.id"
					>{{ v.name }}</i-option>
					</i-select>
				</i-form-item>
				<i-form-item :class="{'_hide-required':!isMustDescribe}" prop="describe" label="备注：">
					<vc-editor
						ref="editor"
						v-model="formData.describe"
						:options="options"
						style="width:520px;"
						@file-error="handleError"
					/>	
				</i-form-item>
			</i-form>
		</i-modal>
	</div>
</template>

<script>
import lodash from 'lodash';
import { services, createSearch, searchCompany, searchTechStaff, staffByNameOrPhone } from '@stores/services/hr';
import { Modal, Form, FormItem, Input, InputNumber, 
	Select, Option, DatePicker, Cascader, Message } from 'iview';
import { Editor, FilesPicker, ImgsPicker, CreatePortal } from "wya-vc";
import API_ROOT from '@stores/apis/root';
import { dataValidity, initTreeData } from '@utils/utils';

export default {
	name: 'v-worksheet-control-bug-resolve-modal',
	components: {
		'i-modal': Modal,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-input': Input,
		'i-input-number': InputNumber,
		'i-select': Select,
		'i-option': Option,
		'i-date-picker': DatePicker,
		'i-cascader': Cascader,
		"vc-editor": Editor,
		'vc-imgs-picker': ImgsPicker
	},
	mixins: [],
	props: {
		name: Number,
		data: {
			type: Object,
			default: () => {}
		},
		is_order: {
			type: Number,
			default: 8
		}
	},
	data() {
		return {
			remote: null,
			visible: false,
			formData: {
				solve_type: this.is_order == 6 ? this.data.solve_type : null,
				describe: ''
			},
			formdataRule: {
				solve_type: [
					{ required: true, type: 'number', message: '请选择解决方案', trigger: 'change' }
				],
				describe: [
					{ required: true, validator: this.describeValidator, trigger: 'change' }
				],
			},
			options: {
				modules: {
					toolbar: '#toolbar',
				},
			},
			resolveList: [
				{
					id: 1,
					name: '设计如此',
				},
				{
					id: 2,
					name: '重复bug',
				},
				{
					id: 3,
					name: '外部原因',
				},
				{
					id: 4,
					name: '已解决',
				},
				{
					id: 5,
					name: '无法重现',
				},
				{
					id: 6,
					name: '延期处理',
				},
				{
					id: 7,
					name: '不予解决',
				}
			]
		};
	},
	computed: {
		isMustDescribe() {
			return (this.formData.solve_type == 6 || this.formData.solve_type == 7) && this.is_order == 8;
		}
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		describeValidator(rule, value, callback) {
			if (this.isMustDescribe && !value) {
				callback('请填写备注');
			} else {
				callback();
			}
		},
		handleError(e) {
			this.$Message.warning(e.msg);
		},
		handleOk() {
			this.$refs.form.validateAndScroll((valid) => {
				if (valid) {
					this.visible = false;
					this.handleSave();
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		},

		handleSave() {
			let param = {
				bug_id: this.data.bug_id,
				describe: this.formData.describe,
				status: this.data.status
			};
			this.is_order == 6 ? '' : param.solve_type = this.formData.solve_type;
			let api_url = this.is_order == 6 ? '_WORKSHEET_CONTROL_BUG_DETAIL_VERIFY_PASS_POST' : '_WORKSHEET_CONTROL_BUG_DETAIL_RESOLVE_POST';
			this.$request({
				url: API_ROOT[api_url], // eslint-disable-line
				type: "POST",
				param
			}).then((res) => {
				Message.success('操作成功');
				this.visible = false;
				this.$emit('sure', true);
			}).catch((error) => {
				Message.error(error.msg);
				this.$store.commit('WORKSHEET_CONTROL_BUG_LIST_INIT');
				this.$refs.modal.buttonLoading = false;
			});
		},

		handleCancel() {
			this.$emit('close');
		}
	}
};
export const ResolveModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-worksheet-control-bug-resolve-modal {
	.vc-quill-editor .ql-editor {
		height: 150px;
	}
	._hide-required.ivu-form-item-required .ivu-form-item-label:before{
		content: ''
	}
	._hide-required .ivu-form-item-error-tip {
		display: none;
	}
}
</style>