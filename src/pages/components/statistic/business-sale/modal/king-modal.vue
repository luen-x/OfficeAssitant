<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:width="400"
		:loading="true"
		:mask-closable="false"
		:title="type === 1 ? '开启月度王中王' : '开启年度王中王'"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<i-form
			ref="form"
			:label-width="110"
			:model="formData"
			:rules="rule"
			class="g-m-t-20"
		>
			<i-form-item
				label="开启时间："
				prop="start_time"
			>
				<i-date-picker
					v-model="formData.start_time"
					:type="type === 1 ? 'month' : 'year'"
					:options="type === 1 ? monthOption : yearOption"
					placeholder="请选择开始时间"
					transfer
					clearable
					style="width: 220px;"
				/>
			</i-form-item>

			<i-form-item
				label="结束时间："
				prop="end_time"
			>
				<i-date-picker
					v-model="formData.end_time"
					:type="type === 1 ? 'month' : 'year'"
					:options="type === 1 ? monthOption : yearOption"
					placeholder="请选择结束时间"
					transfer
					clearable
					style="width: 220px;"
				/>
			</i-form-item> 
		</i-form>
	</i-modal>
</template>

<script>
import { Modal, DatePicker, Form, FormItem } from "iview";
import { CreatePortal } from "wya-vc";
import moment from "moment";

export default {
	name: 'oa-king-modal',
	components: {
		"i-modal": Modal,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-date-picker": DatePicker
	},
	props: {
		type: {
			type: Number,
			required: true
		}
	},
	data() {
		return {
			visible: false,
			formData: {
				start_time: '',
				end_time: ''
			},
			rule: {
				start_time: [
					{
						required: true,
						type: "date",
						message: "开始时间是必填的！",
						trigger: "change"
					}
				],
				end_time: [
					{
						required: true,
						type: "date",
						message: "结束时间是必填的！",
						trigger: "change"
					}
				]
			},
			monthOption: {
				disabledDate(date) {
					let month = new Date();
					let monthOld = month.getFullYear() + '-' + (month.getMonth() < 10 ? '0' + (month.getMonth() + 2) : (month.getMonth() + 2));
		
					return moment(date).isSameOrBefore('2017-12', 'month') || moment(date).isSameOrAfter(monthOld, 'month');
					// let dateNow = new Date();
					// let dateOld = new Date('2018-01');

					// return date 
					// && (date.valueOf() < dateOld.setMonth(dateNow.getMonth() - 3) || date.valueOf() > dateNow.setMonth(dateNow.getMonth()));
				}
			},
			yearOption: {
				disabledDate(date) {
					let dateNow = new Date();
					let dateOld = new Date('2018');

					return date 
					&& (date.getYear() < dateOld.getYear() || date.getYear() > dateNow.getYear());
					// return moment(date).isSameOrBefore('2017', 'year') || moment(date).isSameOrAfter((new Date()).getYear(), 'year');
				}
			}
		};
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			let startTime = new Date(this.formData.start_time);
			let endTime = new Date(this.formData.end_time);
			
			if (startTime.getTime() > endTime.getTime()) {
				this.$Message.warning("开始时间不能晚于结束时间！");
				this.$refs.modal.buttonLoading = false;
				return;
			}

			if (this.type === 1 && this.getMonthRange(startTime, endTime) != 1) {
				this.$Message.warning("评选周期只能选择两个月，请重新选择！");
				this.$refs.modal.buttonLoading = false;
				return;
			}

			if (this.type === 2 && endTime.getFullYear() - startTime.getFullYear() != 1) {
				this.$Message.warning("评选周期只能选择两年，请重新选择！");
				this.$refs.modal.buttonLoading = false;
				return;
			}

			this.$refs.form.validateAndScroll((valid) => {
				if (valid) {
					this.visible = false;

					this.handleSave();
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		},
		handleCancel() {
			this.$emit("close");
		},
		handleSave() {
			this.$request({
				url: '_STATISTIC_BUSINESS_SALE_KING_SAVE_POST',
				type: "POST",
				param: {
					type: this.type,
					start_time: moment(this.formData.start_time).format(this.type === 1 ? "YYYY-MM" : "YYYY"),
					end_time: moment(this.formData.end_time).format(this.type === 1 ? "YYYY-MM" : "YYYY")
				}
			}).then(res => {
				this.$Message.success(res.msg);
				this.$emit("sure", true);
			}).catch(error => {
				this.$Message.error(error.msg);
				this.$refs.modal.buttonLoading = false;
			});
		},
		// 计算两个日期之间相差的月份
		getMonthRange(minDate, maxDate) {
			if (minDate && maxDate) {
				let minYear = minDate.getFullYear();
				let minMonth = minDate.getMonth() + 1;
				let maxYear = maxDate.getFullYear();
				let maxMonth = maxDate.getMonth() + 1;
				return (maxYear * 12 + maxMonth) - (minYear * 12 + minMonth);
			} else {
				return '';
			}
		}
	}
};
export const KingModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" scoped>
</style>