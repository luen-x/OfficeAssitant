<template>
	<div>
		<i-modal
			ref="modal"
			v-model="visible"
			:loading="true"
			:mask-closable="false"
			class="c-social-interview-modal"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<div
				slot="header"
				class="g-tc"
			>
				{{ title }}
			</div>
			<i-form
				ref="formValidate"
				:model="formValidate"
				:rules="ruleValidate"
				:label-width="120"
				class="g-m-t-20"
			>
				<i-formitem
					v-if="type !== 'expect'"
					prop="interviewer_ids"
					label="指派面试官:"
				>
					<i-select
						v-model="formValidate.interviewer_ids"
						:placeholder="`${type === 'keep' ? '请输入新面试官' : '请输入面试官'}`"
						style="width: 220px;"
						multiple
						filterable
						clearable
						transfer
					>
						<i-option
							v-for="(item, index) in staffData"
							:key="index"
							:value="item.value"
						>{{ item.label }}</i-option>
					</i-select>
				</i-formitem>
				<i-formitem
					v-if="type === 'expect'"
					prop="predict_interview_time"
					label="预计面试时间:"
				>
					<i-date-picker
						v-model="formValidate.predict_interview_time"
						placeholder="请输入预计面试时间"
						type="datetime"
						format="yyyy-MM-dd HH:mm"
						style="width: 220px;"
						transfer
					/>
				</i-formitem>
				<i-formitem
					v-else
					prop="interview_time"
					label="实际面试时间:"
				>
					<i-date-picker
						v-model="formValidate.interview_time"
						:placeholder="`${type === 'edit' ? '请输入实际面试时间' : '请输入新实际面试时间'}`"
						type="datetime"
						format="yyyy-MM-dd HH:mm"
						style="width: 220px;"
						transfer
					/>
				</i-formitem>
			</i-form>
		</i-modal>
	</div>
</template>

<script>
import {
	Modal,
	Form,
	FormItem,
	Select,
	Option,
	DatePicker,
	InputNumber
} from "iview";
import { CreatePortal } from "wya-vc";
import LimitWords from "@components/_common/limit-words/limit-words";
import API_ROOT from "@stores/apis/root";
import { createSearch } from "@stores/services/hr";
import moment from "moment";
import { initTreeData } from "@utils/utils";

export default {
	name: "hr-social-keep-interview-modal",
	components: {
		"i-modal": Modal,
		"i-form": Form,
		"i-formitem": FormItem,
		"i-input-number": InputNumber,
		"i-select": Select,
		"i-option": Option,
		"i-date-picker": DatePicker
	},
	mixins: [createSearch({ key: "staff" })],
	props: {
		applicantId: String | Number,
		type: {
			type: String,
			validator(value) {
				return ["edit", "keep", "expect"].indexOf(value) !== -1;
			}
		},
		step: String | Number,
		info: {
			type: Object,
			default() {
				return {};
			}
		}
	},
	data() {
		return {
			staff: this.info.interviewer_name || "",
			visible: false,
			formValidate: {
				...this.info
			},
			ruleValidate: {
				interview_time: [
					{
						required: true,
						type: "object",
						message: "请选择新实际面试时间",
						trigger: "change"
					}
				],
				predict_interview_time: [
					{
						required: true,
						type: "object",
						message: "请选择预计面试时间",
						trigger: "change"
					}
				],
				interviewer_ids: [
					{
						required: false,
						type: "array",
						message: "请输入新面试官",
						trigger: "change"
					}
				]
			}
		};
	},
	computed: {
		title() {
			const obj = {
				expect: "修改预计面试信息",
				keep: "继续面试",
				edit: "修改实际面试信息"
			};
			return obj[this.type];
		}
	},
	mounted() {
		this.visible = true;
		this.loadStaffData();
	},
	methods: {
		handleOk() {
			this.$refs.formValidate.validate(valid => {
				if (valid) {
					this.handleSave();
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		},
		handleCancel() {
			this.$emit("close");
		},
		handleChange(value, type) {
			this.formValidate[type] = value;
		},
		handleSave() {
			const urlObj = {
				edit: "HR_RECRUIT_SOCIAL_SUMMARY_EDIT_DESIGNATE_POST",
				keep: "HR_RECRUIT_SOCIAL_SUMMARY_KEEP_INTERVIEW_POST",
				expect: "HR_RECRUIT_SOCIAL_SUMMARY_EXPECT_INTERVIEW_POST"
			};
			app.$store
				.dispatch("request", {
					url: urlObj[this.type],
					type: "POST",
					param: {
						applicant_id: this.applicantId,
						step: this.step,
						interview_time: moment(this.formValidate.interview_time).format(
							"YYYY-MM-DD HH:mm"
						),
						predict_interview_time: moment(
							this.formValidate.predict_interview_time
						).format("YYYY-MM-DD HH:mm"),
						interviewer_ids: this.formValidate.interviewer_ids
					}
				})
				.then(res => {
					res.msg && this.$Message.success(res.msg);
					this.$refs.modal.buttonLoading = false;
					this.visible = false;
					this.$emit("sure");
				})
				.catch(error => {
					this.$Message.error(error.msg);
					this.$refs.modal.buttonLoading = false;
				});
		},
		loadStaffData() {
			this.$request({
				url: API_ROOT._HR_STAFF_GET,
				type: "GET",
				param: {
					name: ""
				},
				loading: false
			}).then(res => {
				this.staffData = initTreeData(res.data, "value", "text");
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		}
	}
};
export const InterviewModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.c-social-interview-modal {
  .ivu-modal-wrap .ivu-modal {
	width: 400px !important;
  }
  .ivu-form-item-label {
	color: #333333;
  }
  .ivu-modal-body {
	padding: 0 !important;
  }
  .ivu-modal-footer {
	padding: 0 20px 20px 20px !important;
  }
}
</style>
