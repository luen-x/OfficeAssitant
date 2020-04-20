<template>
	<div>
		<i-modal
			ref="modal"
			:loading="true"
			v-model="visible"
			:width="680"
			:mask-closable="false"
			:title="is_order == 4 ? '指派bug' : '激活bug'"
			class="v-worksheet-control-bug-order-modal"
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
				<i-form-item label="指派:" prop="assign_staff_id">
					<i-select
						ref="staff_assign"
						:value="formData.assign_staff_id"
						:remote-method="loadTechStaff"
						:loading="staffTechLoading"
						class="g-m-r-5"
						style="width: 300px;"
						filterable
						remote
						clearable
						transfer
						label-in-value
						placeholder="请输入指派人员"
						@on-query-change="handleQueryAssignChange"
						@on-change="handleChangeAssign({assign_staff_id: arguments[0]})"
					>
						<i-option
							v-for="(item, index) in staffTechData"
							:key="index"
							:value="item.staff_id"
						>{{ item.staff_name }}</i-option>
					</i-select>
				</i-form-item>
				<i-form-item label="抄送：" prop="copy_for_staff_ids">
					<i-select
						ref="staff_copy"
						:value="formData.copy_for_staff_ids"
						:remote-method="remote"
						:loading="staffLoading"
						class="g-m-r-5"
						style="width: 300px;"
						multiple
						filterable
						remote
						clearable
						transfer
						placeholder="请选择抄送人员"
						@on-change="handleChangeCopy({copy_for_staff_ids: arguments[0]})"
					>
						<i-option
							v-for="(item, index) in staffData"
							:key="index"
							:value="item.value"
						>{{ item.label }}</i-option>
					</i-select>
				</i-form-item>
				<i-form-item label="备注：" prop="describe">
					<vc-editor
						ref="editor"
						v-model="formData.describe"
						:options="options"
						style="width:520px;"
						@file-error="handleError"
					/>	
				</i-form-item>
				<i-form-item class="_label" label="敏感信息:" prop="sensitive_info">
					<oa-limit-words
						v-model="formData.sensitive_info" 
						:max="200" 
						style="width:520px;"
						class="g-dp-ib"
						placeholder="请填写备注信息"
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
	name: 'v-worksheet-control-bug-order-modal',
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
	mixins: [
		staffByNameOrPhone,
		searchCompany,
		searchTechStaff
	],
	props: {
		name: Number,
		data: {
			type: Object,
			default: () => {}
		},
		is_order: {
			type: Number,
			default: 4 // 4 指派
		}
	},
	data() {
		return {
			remote: null,
			visible: false,
			formData: {
				bug_id: this.data.bug_id,
				assign_staff_id: null,
				copy_for_staff_ids: [],
				describe: '',
				sensitive_info: ''
			},
			formdataRule: {
				assign_staff_id: [
					{ required: true, type: 'number', message: '请选择指派人员', trigger: 'change' }
				],
			},
			options: {
				modules: {
					toolbar: '#toolbar',
				},
			},
		};
	},
	mounted() {
		this.handleLoadStaffData(() => {
			this.remote = this.loadStaff();
		});
		if (this.is_order !== 4) {
			this.loadInfo();
		}
		this.visible = true;
	},
	methods: {
		loadInfo() {
			return this.$request({
				url: '_WORKSHEET_CONTROL_TECH_EDIT_INFO_GET',
				type: "GET",
				param: {
					bug_id: this.data.bug_id,
					opt_type: 2
				},
				loading: false
			}).then((res) => {
				this.$refs.staff_assign.query = res.data.pre_solve_staff_name;
				this.formData.assign_staff_id = res.data.pre_solve_staff_id;
				// this.formData.copy_for_staff_ids = res.data.copy_for_staff_ids.split(',').map(Number);
			}).then(res => {
				this.loadTechStaff(this.$refs.staff_assign.query);
				this.loadStaff('1');
			}).catch((error) => {
			});
		},
		handleError(e) {
			this.$Message.warning(e.msg);
		},
		handleChangeCopy(obj) {
			if (obj.copy_for_staff_ids.length > 10) {
				this.$refs.staff_copy.values.pop();
				this.$Message.warning('最多选择10个抄送人员');
			} else {
				this.formData.copy_for_staff_ids = obj.copy_for_staff_ids;
			}
		},
		handleQueryAssignChange(query = '') {
			let targetQuery = this.formData.assign_staff_name || '';
			if (targetQuery.length > query.length) {
				this.$refs.staff_assign.clearSingleSelect();
			}
		},
		handleChangeAssign(obj) {
			let value = obj['assign_staff_id'];
			this.formData.assign_staff_id = value ? value.value : '';
			this.formData.assign_staff_name = value ? value.label : '';
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
		// 设置远程搜索刷新后值保持
		handleLoadStaffData() {
			return this.$request({
				url: API_ROOT._HR_MUTI_TERM_STAFF_GET,
				type: 'GET',
				param: {
					search: '1' // 为了能搜索到全部的员工数据（手机号码必定有1）
				},
				loading: false
			}).then((res) => {
				this.staff = Number(this.$route.query.staff_id);
				this.staffData = initTreeData(res.data, 'staff_id', 'staff_name');
			}).then(() => {
				this.remote = this.loadStaff;
			}).catch((error) => {
					
			});
		},

		handleSave() {
			let obj = {
				bug_id: this.data.bug_id,
				assign_staff_id: this.formData.assign_staff_id,
				copy_for_staff_ids: this.formData.copy_for_staff_ids.join(','),
				describe: this.formData.describe,
				sensitive_info: this.formData.sensitive_info,
				status: this.data.status
			};
			this.is_order == 4 ? obj.pre_assign_staff_id = this.data.assign_staff_id : '';
			let api_url = this.is_order == 4 ? '_WORKSHEET_CONTROL_BUG_DETAIL_ASSIGN_POST' : '_WORKSHEET_CONTROL_BUG_DETAIL_ACTIVATE_POST';
			this.$request({
				url: API_ROOT[api_url], // eslint-disable-line
				type: "POST",
				param: obj
			}).then((res) => {
				let text = this.is_order == 4 ? '指派' : '激活';
				Message.success(text + '成功');
				this.visible = false;
				this.$emit('sure');
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
export const OrderModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-worksheet-control-bug-order-modal {
	.vc-quill-editor .ql-editor {
		height: 150px;
	}
}
</style>