<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		class="g-flex v-hr-employee-relation-leave-modal"
		width="400"
		@on-ok="handleOk"
		@on-cancel="handleCancel">

		<div slot="header" class="g-tc">
			{{ title }}
		</div>

		<div v-if="data.action === 'confirm'" class="g-fs-14">
			<div class="g-m-l-20">
				<span
					v-if="(data.info.has_apply === 1 && data.info.is_apply === 0) ||
				(data.info.has_interview === 1 && data.info.is_interview === 0)">
					该员工的离职信息尚未完善，
				</span>是否确定离职？
			</div>

			<i-form
				ref="form"
				:model="form"
				:rules="rule"
				:label-width="110"
				class="g-m-lr-20 g-m-t-20">
				<i-form-item label="实际离职日期：" prop="leave_time">
					<i-date-picker
						v-model="form.leave_time"
						:options="dateOption"
						type="date"
						clearable
						transfer
						placeholder="请选择实际离职日期"
						style="width: 220px"/>
				</i-form-item>
			</i-form>
		</div>

		<div v-if="data.action === 'delete'" class="_only-text g-fs-14">
			是否确定删除？
		</div>

		<div v-if="data.action === 'add'" class="g-flex g-fd-c g-ai-c g-m-t-10">
			<i-form
				ref="addForm"
				:model="addForm"
				:rules="addRule"
				:label-width="84">

				<i-form-item label="员工姓名" prop="staff_id">
					<i-select
						ref="staff"
						v-model="addForm.staff_id"
						:remote-method="loadStaff"
						:loading="staffLoading"
						style="width: 220px;"
						filterable
						remote
						clearable
						transfer
						label-in-value
						class="g-m-r-10"
						placeholder="请输入员工姓名/手机号"
						@on-change="handleStaffChange"
						@on-query-change="handleQueryChange"
					>
						<i-option
							v-for="(item, index) in staffData"
							:key="index"
							:value="item.value"
						>{{ item.label }}</i-option>
					</i-select>
				</i-form-item>

				<i-form-item label="离职时间" prop="leave_time">
					<i-date-picker
						v-model="addForm.leave_time"
						type="date"
						clearable
						transfer
						placeholder="请选择离职时间"
						style="width: 220px;"/>
				</i-form-item>

			</i-form>
		</div>
	</i-modal>
</template>

<script>
import API_ROOT from "@stores/apis/root";
import { CreatePortal, Copy } from "wya-vc";
import { formatMoment } from "@utils/utils";
import { staffByNameOrPhone } from '@stores/services/hr';
import { DatePicker, Form, FormItem, Input, Modal, Select, Option } from "iview";

export default {
	name: "hr-employee-relation-leave-modal",
	components: {
		"i-modal": Modal,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-input": Input,
		"i-select": Select,
		"i-option": Option,
		"i-date-picker": DatePicker,
		"vc-copy": Copy
	},
	mixins: [staffByNameOrPhone],
	props: {
		data: Object
	},
	data() {
		return {
			visible: false,
			title: '',
			addForm: {},
			form: {},
			rule: {
				leave_time: [{ required: true, type: 'object', message: "请选择实际离职日期", trigger: "change" }]
			},
			addRule: {
				staff_id: [{ required: true, message: '员工姓名不能为空', trigger: 'change', pattern: /.+/ }],
				leave_time: [{ required: true, message: '离职时间不能为空', trigger: 'change', type: 'object' }],
			},
			dateOption: {
				disabledDate(date) {
					return date && date.valueOf() > Date.now();
				}
			}
		};
	},
	computed: {},
	mounted() {
		this.visible = true;
		switch (this.data.action) {
			case 'add':
				this.title = "新增离职";
				break;
			case 'confirm':
				this.title = "离职确认";
				break;
			case 'delete':
				this.title = "删除";
				break;
			default:
				break;
		}
	},
	methods: {
		// 员工
		handleStaffChange(obj) {
			this.addForm.staff_id = obj && obj.value ? obj.value : '';
			this.addForm.staff_name = obj && obj.label ? obj.label : '';
		},
		handleQueryChange(query = '') {
			let targetQuery = this.addForm.staff_name || '';
			if (targetQuery.length > query.length) {
				this.$refs.staff.clearSingleSelect();
			}
		},
		handleOk() {
			/**
             * v-model会默认被触发，要由该组件控制，给组件i-modal传值 loading: true
             */
			// this.visible = false;

			if (this.data.action === 'add') { 	// 新增离职

				this.$refs['addForm'].validate(valid => {
					if (valid) {
						this.$request({
							url: API_ROOT._HR_EMPLOYEE_RELATION_LEAVE_ADD_POST,
							type: "POST",
							param: {
								...this.addForm,
								leave_time: formatMoment(this.addForm.leave_time)
							},
							loading: false
						}).then(res => {
							this.$emit("sure");
						}).catch(err => {
							this.$refs.modal.buttonLoading = false;
							this.$Message.error(err.msg);
						});

					} else {
						this.$refs.modal.buttonLoading = false;
						this.$Message.warning('请按照提示信息完善表单');
					}
				});

			} else if (this.data.action === 'confirm') { // 离职确认

				this.$refs['form'].validate(valid => {
					if (valid) {
						this.$request({
							url: API_ROOT._HR_EMPLOYEE_RELATION_LEAVE_CONFIRM_GET,
							type: "GET",
							param: {
								staff_id: this.data.info.staff_id,
								leave_time: formatMoment(this.form.leave_time)
							}
						}).then(res => {
							this.$emit("sure");
						}).catch(err => {
							this.$refs.modal.buttonLoading = false;
							this.$Message.error(err.msg);
						});
					} else {
						this.$refs.modal.buttonLoading = false;
						this.$Message.warning('请按照提示完善表单信息');
					}
				});

			} else if (this.data.action === 'delete') {	// 删除

				this.$request({
					url: API_ROOT._HR_EMPLOYEE_RELATION_LEAVE_DELETE_GET,
					type: "GET",
					param: {
						staff_id: this.data.info.staff_id,
						leave_id: this.data.info.leave_id
					}
				}).then(res => {
					this.$emit("sure");
				}).catch(err => {
					this.$refs.modal.buttonLoading = false;
					this.$Message.error(err.msg);
				});

			}
		},
		handleCancel() {
			this.$emit("close");
		}
	}
};
export const PModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" scoped>
.v-hr-employee-relation-leave-modal {
	._only-text {
		padding: 34px;
		padding-top: 44px;
		padding-bottom: 24px;
		color: #333;
	}
}
</style>
