<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:width="400"
		:mask-closable="false"
		class="c-modal-container"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div
			slot="header"
			class="g-tc"
		>
			添加日程
		</div>
		<i-form
			ref="formValidate"
			:label-width="100"
			:model="formValidate"
			:rules="ruleValidate"
			class="g-m-t-20"
		>
			<i-formitem
				label="提醒:"
				prop="content"
			>
				<i-input
					v-model="formValidate.content"
					:maxlength="15"
					style="width: 220px"
					placeholder="请输入提示文字(最多15个字)"
				/>
			</i-formitem>
			<i-formitem
				label="提醒日期:"
				prop="date"
			>
				<i-datepicker
					v-model="formValidate.date"
					style="width: 220px"
					placeholder="请选择提醒日期"
					transfer
					@on-change="handleChange"
				/>
			</i-formitem>
			<i-formitem label="截止日期:">
				<i-datepicker
					v-model="formValidate.end_date"
					style="width: 220px"
					placeholder="请选择截止日期"
					transfer
				/>
			</i-formitem>
		</i-form>
	</i-modal>
</template>

<script>
import { Modal, DatePicker, Form, FormItem, Input } from "iview";
import { CreatePortal } from "wya-vc";
import API_ROOT from "@stores/apis/root";
import moment from "moment";



export default {
	name: "sc-main-add-modal",

	components: {
		"i-modal": Modal,
		"i-datepicker": DatePicker,
		"i-form": Form,
		"i-formitem": FormItem,
		"i-input": Input
	},

	props: {
		record_id: String,
		edit: Boolean,
		remind_date: String,
		remind_end_date: String,
		content: String,
		flag: Boolean, // 判断是否是首页新增
		eve_date: String,
		dates: String
	},

	data() {
		// const validateDate = (rule, date, callback) => {
		// 	if (!date) {
		// 		return callback(new Error('提醒日期不能为空'));
		// 	} else if (date && (date.valueOf() > new Date(this.formValidate.end_date).getTime())) {
		// 		callback('提醒日期不能大于截止日期');
		// 	} else {
		// 		callback();
		// 	}   
		// };

		// const validateEndDate = (rule, end_date, callback) => {
		// 	if (!end_date) {
		// 		return callback(new Error('截止日期不能为空'));
		// 	} else if (end_date && (end_date.valueOf() < new Date(this.formValidate.date).getTime())) {
		// 		callback('提醒日期不能大于截止日期');
		// 	} else {
		// 		callback();
		// 	}   
		// };

		return {
			visible: false,
			date: "",
			formValidate: {
				content: "",
				remind_date: "",
				date: "",
				end_date: "",
				remind_end_date: ""
			},
			ruleValidate: {
				content: [
					{
						required: true,
						message: "提醒内容不能为空！",
						trigger: "blur"
					}
				],
				date: [
					{
						required: true,
						message: "提醒日期不能为空！",
						trigger: "change",
						type: "date"
					}
				]
			}
		};
	},

	mounted() {
		if (this.flag) {
			this.dates ? this.formValidate.date = this.dates : this.formValidate.date = moment().format("YYYY-MM-DD");
			this.dates ? this.formValidate.end_date = this.dates : this.formValidate.end_date = moment().format("YYYY-MM-DD");
		} else if (this.edit) {
			this.formValidate.content = this.content;
			this.formValidate.date = this.remind_date;
			this.formValidate.end_date = this.remind_end_date;
		} else {
			this.formValidate.date = this.eve_date && moment(this.eve_date).format("YYYY-MM-DD");
			this.formValidate.end_date = this.eve_date && moment(this.eve_date).format("YYYY-MM-DD");
		}

		this.visible = true;
	},

	methods: {
		handleOk() {
			this.formValidate.remind_date = this.formValidate.date
				&& moment(this.formValidate.date).format("YYYY-MM-DD");
			this.formValidate.remind_end_date = this.formValidate.end_date
				&& moment(this.formValidate.end_date).format("YYYY-MM-DD");

			if (new Date(this.formValidate.date).getTime() > new Date(this.formValidate.end_date).getTime()) {
				this.$Message.warning("提醒日期不能大于截止日期");
				this.$refs.modal.buttonLoading = false;

				return;
			}
				

			this.$refs.formValidate.validateAndScroll(valid => {
				if (valid) {
					this.handleSave();
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		},

		handleSave() {
			let API = this.edit ? "_SC_MAIN_EDIT_REMIND_POST" : "_SC_MAIN_ADD_REMIND_POST";

			this.$request({
				url: API_ROOT[API],
				type: "POST",
				param: {
					record_id: this.edit ? this.record_id : "",
					content: this.formValidate.content,
					remind_date: this.formValidate.remind_date,
					remind_end_date: this.formValidate.remind_end_date

				}
			}).then(res => {
				this.$Message.success(res.msg);
			}).then(() => {
				this.$refs.modal.buttonLoading = false;
				this.visible = false;
				this.$emit("sure", true);
			}).catch(error => {
				this.$Message.error(error.msg);

				this.$refs.modal.buttonLoading = false;
			});
		},

		handleCancel() {
			this.$emit("close");
		},

		handleChange(v) {
			this.formValidate.end_date = v;
		}
	}
};
export const AddSchedModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
</style>