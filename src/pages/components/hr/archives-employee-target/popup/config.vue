<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		title="季度配置"
		class="v-hr-archives-employee-target-config-modal"
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
				<i-form-item label="月份类型：" prop="type">
					<i-select
						v-model="formData.type"
						placeholder="请选择月份类型"
						style="width: 220px"
						clearable
						transfer>
						<i-option
							v-for="item in typeList"
							:key="item.value"
							:value="item.value">
							{{ item.label }}
						</i-option>
					</i-select>
				</i-form-item>
				<i-form-item label="起始月份：" prop="start_time">
					<i-date-picker
						v-model="formData.start_time"
						type="month"
						clearable
						transfer
						placeholder="请选择起始月份"
						style="width: 220px" />
				</i-form-item>
				<i-form-item label="结束月份：" prop="end_time">
					<i-date-picker
						v-model="formData.end_time"
						type="month"
						clearable
						transfer
						placeholder="请选择结束月份"
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
import { Modal, Form, FormItem, DatePicker, Select, Option } from "iview";

export default {
	name: "hr-archives-employee-target-config-modal",
	components: {
		"i-modal": Modal,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-date-picker": DatePicker,
		"i-select": Select,
		"i-option": Option,
	},
	props: {},
	data() {
		return {
			visible: false,
			formData: {
				start_time: '',
				end_time: ''
			},
			rule: {
				start_time: [{ required: true, message: "请选择评定开始月", type: 'object', trigger: "change" }],
				type: [{ required: true, message: "请选择月份类型", pattern: /.+/, trigger: "change" }],
				end_time: [{ required: true, message: "请选择评定结束月", type: 'object', trigger: "change" }]
			},
			typeList: [
				{ label: '季度时间', value: 1 },
				{ label: '半年度时间', value: 2 }
			]
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
					let start = moment(this.formData.start_time).format('YYYY-MM');
					let end = moment(this.formData.end_time).format('YYYY-MM');

					if (this.compareTime(start, end)) {
						this.$request({ 	// 季度配置
							url: 'HR_ARCHIVES_EMPLOYEE_TARGET_CONFIG_GET',
							type: "GET",
							param: {
								start_time: start,
								end_time: end,
								type: this.formData.type
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
export const configPModal = CreatePortal({}, module.exports.default);
</script>
