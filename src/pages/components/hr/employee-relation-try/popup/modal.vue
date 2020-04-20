<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		class="g-flex v-hr-employee-relation-try-modal"
		width="400"
		@on-ok="handleOk"
		@on-cancel="handleCancel">

		<div slot="header" class="g-tc">
			{{ type === 'fail' ? '下次转正配置' : '转正确认' }}
		</div>

		<div class="g-fs-14">
			<div v-if="type !== 'fail'" class="g-m-l-20">
				<span
					v-if="(info.has_apply === 1 && info.is_apply === 0) ||
				(info.has_interview === 1 && info.is_interview === 0)">
					该员工的转正信息尚未完善，
				</span>是否确认转正?
			</div>

			<i-form
				ref="form"
				:model="form"
				:rules="rule"
				:label-width="110"
				class="g-m-lr-20 g-m-t-20">
				<i-form-item v-if="type === 'fail'" label="下次转正日期：" prop="next_regular_time">
					<i-date-picker
						v-model="form.next_regular_time"
						:options="dateOption1"
						type="date"
						clearable
						transfer
						placeholder="请选择下次转正日期"
						style="width: 220px"/>
				</i-form-item>
				<i-form-item v-if="type === 'confirm'" label="实际转正日期：" prop="regular_time">
					<i-date-picker
						v-model="form.regular_time"
						:options="dateOption2"
						type="date"
						clearable
						transfer
						placeholder="请选择实际转正日期"
						style="width: 220px"/>
				</i-form-item>
			</i-form>
		</div>

	</i-modal>
</template>

<script>
import moment from 'moment';
import API_ROOT from "@stores/apis/root";
import { Modal, DatePicker, Form, FormItem } from "iview";
import { CreatePortal, Copy } from "wya-vc";
import { formatMoment } from "@utils/utils";

export default {
	name: "hr-employee-relation-try-modal",
	components: {
		"i-modal": Modal,
		"vc-copy": Copy,
		"i-form": Form,
		"i-form-item": FormItem,
		'i-date-picker': DatePicker
	},
	props: {
		info: Object,
		type: String
	},
	data() {
		return {
			visible: false,
			form: {},
			rule: {
				regular_time: [{ required: true, type: 'object', message: "请选择实际转正日期", trigger: "change" }],
				next_regular_time: [{ required: true, type: 'object', message: "请选择下次转正日期", trigger: "change" }]
			},
			dateOption1: {},
			dateOption2: {
				disabledDate(date) {
					return date && date.valueOf() > Date.now();
				}
			}
		};
	},
	computed: {},
	mounted() {
		this.visible = true;
		let time = moment(this.info.regular_time).toDate();
		// 下次转日期只能选择转正日期及转正日期以后的日期
		if (time) {
			this.dateOption1 = {
				disabledDate(date) {
					return date && date.valueOf() < time.valueOf();
				}
			};
		}
	},
	methods: {
		handleOk() {
			/**
             * v-model会默认被触发，要由该组件控制，给组件i-modal传值 loading: true
             */
			// 转正确认弹框
			this.$refs['form'].validate(valid => {
				if (valid) {
					if (this.type === 'fail') {
						this.$request({
							url: API_ROOT._HR_EMPLOYEE_RELATION_TRY_FAIL_GET,
							type: "GET",
							param: {
								staff_id: this.info.staff_id,
								regular_time: formatMoment(this.form.next_regular_time)
							},
							loading: false
						}).then(res => {
							this.$emit("sure");
							this.$Message.success("操作成功");
							this.$store.commit('HR_EMPLOYEE_RELATION_TRY_LIST_INIT');
						}).catch(err => {
							this.$Message.warning(err.msg);
							this.$refs.modal.buttonLoading = false;
						});
					} else if (this.type === 'confirm') {
						this.$request({
							url: API_ROOT._HR_EMPLOYEE_RELATION_TRY_CONFIRM_GET,
							type: "GET",
							param: {
								staff_id: this.info.staff_id,
								regular_time: formatMoment(this.form.regular_time)
							},
							loading: false
						}).then(res => {
							this.$emit("sure");
							this.$Message.success("操作成功");
							this.$store.commit('HR_EMPLOYEE_RELATION_TRY_LIST_INIT');
						}).catch(err => {
							this.$Message.warning(err.msg);
							this.$refs.modal.buttonLoading = false;
						});
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
export const PModal = CreatePortal({}, module.exports.default);
</script>
