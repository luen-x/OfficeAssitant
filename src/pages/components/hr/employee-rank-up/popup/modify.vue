<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		:title="type === 'open' ? '开启评定' : '编辑周期'"
		class="v-hr-employee-rank-up-modify-modal"
		width="400"
		@on-ok="handleOk"
		@on-cancel="handleCancel">

		<div class="g-fs-14 _content">
			<i-form
				ref="form"
				:model="formData"
				:rules="rule"
				:label-width="110"
				class="g-m-lr-15 g-m-t-20">
				<i-form-item label="评定开始月：" prop="start_month">
					<i-date-picker
						v-model="formData.start_month"
						type="month"
						clearable
						transfer
						placeholder="请选择评定开始月"
						style="width: 220px" />
				</i-form-item>
				<i-form-item label="评定结束月：" prop="end_month">
					<i-date-picker
						v-model="formData.end_month"
						type="month"
						clearable
						transfer
						placeholder="请选择评定结束月"
						style="width: 220px" />
				</i-form-item>
			</i-form>
		</div>

	</i-modal>
</template>

<script>
import moment from 'moment';
import API_ROOT from "@stores/apis/root";
import { CreatePortal, Copy } from "wya-vc";
import { formatMoment } from "@utils/utils";
import { Modal, Form, FormItem, DatePicker } from "iview";

export default {
	name: "hr-employee-rank-up-modify-modal",
	components: {
		"i-modal": Modal,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-date-picker": DatePicker,
	},
	props: {
		system_id: Number | String,
		type: String,
		cycle_id: Number | String
	},
	data() {
		return {
			visible: false,
			formData: {
				start_month: '',
				end_month: ''
			},
			rule: {
				start_month: [{ required: true, message: "请选择评定开始月", type: 'object', trigger: "change" }],
				end_month: [{ required: true, message: "请选择评定结束月", type: 'object', trigger: "change" }]
			}
		};
	},
	computed: {},
	mounted() {
		this.visible = true;
	},
	methods: {
		compareTime(start, end) {
			let time1 = start.split('-');
			let time2 = end.split('-');
			if (Number(time1[0]) < Number(time2[0])) {
				return true;
			} else if (Number(time1[0]) === Number(time2[0])) {
				if (Number(time1[1]) <= Number(time2[1])) {
					return true;
				} else {
					this.$Message.error('开始月份不能小于结束月份');
					return false;
				}
			} else {
				this.$Message.error('开始时间不能小于结束时间');
				return false;
			}
		},
		handleOk() {
			/**
             * v-model会默认被触发，要由该组件控制，给组件i-modal传值 loading: true
             */

			this.$refs['form'].validate(valid => {
				if (valid) {
					let start = moment(this.formData.start_month).format('YYYY-MM');
					let end = moment(this.formData.end_month).format('YYYY-MM');

					if (this.type === 'open') {
						if (this.compareTime(start, end)) {
							this.$request({ 	// 开启周期
								url: '_HR_EMPLOYEE_UP_START_CYCLE_POST',
								type: "POST",
								param: {
									system_id: this.system_id,
									start_month: start,
									end_month: end
								},
								loading: false
							}).then(res => {
								this.$Message.success("操作成功");
								this.$emit("sure");
							}).catch(err => {
								this.$Message.warning(err.msg);
								this.$refs.modal.buttonLoading = false;
							});
						} else {
							this.$refs.modal.buttonLoading = false;
						}
					} else if (this.compareTime(start, end)) {
						this.$request({ 	// 编辑周期
							url: '_HR_EMPLOYEE_UP_EDIT_CYCLE_POST',
							type: "POST",
							param: {
								system_id: this.system_id,
								cycle_id: this.cycle_id,
								start_month: start,
								end_month: end
							},
							loading: false
						}).then(res => {
							this.$Message.success("操作成功");
							this.$emit("sure");
						}).catch(err => {
							this.$Message.warning(err.msg);
							this.$refs.modal.buttonLoading = false;
						});
					} else {
						this.$refs.modal.buttonLoading = false;
					}
				} else {
					this.$refs.modal.buttonLoading = false;
					this.$Message.warning('请按照提示完善表单信息');
				}
			});
		},
		handleCancel() {
			this.$emit("close");
		}
	}
};
export const modifyPModal = CreatePortal({}, module.exports.default);
</script>
