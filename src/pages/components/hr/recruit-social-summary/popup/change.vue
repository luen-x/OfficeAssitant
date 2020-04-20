<template>
	<div>
		<i-modal
			ref="modal"
			v-model="visible"
			:loading="true"
			:mask-closable="false"
			class="c-social-change-modal"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<div slot="header" class="g-tc">
				变更
			</div>
			<i-form
				ref="formValidate"
				:model="formValidate"
				:rules="ruleValidate"
				:label-width="130"
				class="g-m-t-20"
			>
				<i-formitem
					prop="status"
					label="变更到:"
				>
					<i-select
						v-model="formValidate.status"
						style="width: 220px"
						clearable
						transfer
						placeholder="请选择变更类型"
					>
						<i-option
							v-for="(item, index) in curChangeType"
							:key="index"
							:value="item.value"
						>
							{{ item.label }}
						</i-option>
					</i-select>
				</i-formitem>
				<i-formitem
					v-if="formValidate.status == 14"
					prop="predict_interview_time"
					label="预计面试时间:"
				>
					<i-date-picker
						v-model="formValidate.predict_interview_time"
						type="datetime"
						format="yyyy-MM-dd HH:mm"
						style="width: 220px;"
						transfer
						placeholder="请选择预计面试时间"
					/>
				</i-formitem>
				<i-formitem
					v-if="formValidate.status == 13"
					prop="interview_time"
					label="实际面试时间:"
				>
					<i-date-picker
						v-model="formValidate.interview_time"
						type="datetime"
						format="yyyy-MM-dd HH:mm"
						style="width: 220px;"
						transfer
						placeholder="请选择实际面试时间"
					/>
				</i-formitem>
				<div v-if="formValidate.status == 13">
					<i-formitem
						label="指派面试官:"
					>
						<i-select
							v-model="formValidate.interviewer_ids"
							style="width: 220px;"
							filterable
							remote
							clearable
							multiple 
							transfer
							placeholder="请输入面试官"
						>
							<i-option
								v-for="(item, index) in staffData"
								:key="index"
								:value="item.value"
							>{{ item.label.trim() }}</i-option>
						</i-select>
					</i-formitem>
				</div>
				<!-- <div v-if="formValidate.status == 2">
					<i-formitem
						label="发offer时间:"
					>
						<i-date-picker
							v-model="formValidate.send_offer_time"
							type="date"
							style="width: 220px;"
							placeholder="请选择发offer时间"
						/>
					</i-formitem>
				</div> -->
				<div v-if="formValidate.status == 3">
					<i-formitem
						prop="try_start_time"
						label="试岗时间:"
					>
						<i-date-picker
							v-model="formValidate.try_start_time"
							type="daterange"
							transfer
							style="width: 220px;"
							placeholder="请选择试岗时间"
						/>
					</i-formitem>
				</div>
				<i-formitem
					v-if="formValidate.status == 4"
					prop="predict_entry_time"
					label="预计入职时间:"
				>
					<i-date-picker
						v-model="formValidate.predict_entry_time"
						type="date"
						transfer
						style="width: 220px;"
						placeholder="请选择预计入职时间"
					/>
				</i-formitem>
			</i-form>
		</i-modal>
	</div>
</template>

<script>
import { Modal, Form, FormItem, Select, Option, DatePicker, InputNumber } from 'iview';
import { CreatePortal } from 'wya-vc';
import LimitWords from '@components/_common/limit-words/limit-words';
import API_ROOT from '@stores/apis/root';
import { createSearch } from '@stores/services/hr';
import moment from 'moment';
import { getParseUrl, getHashUrl, initTreeData } from '@utils/utils';


export default {
	name: 'hr-position-add-modal',
	components: {
		'i-modal': Modal,
		'i-form': Form,
		'i-formitem': FormItem,
		'i-input-number': InputNumber,
		'i-select': Select,
		'i-option': Option,
		'i-date-picker': DatePicker
	},
	mixins: [createSearch({ key: 'staff' })],
	props: {
		applicantId: String | Number,
		status: String | Number,
		query: Object
	},
	data() {
		let validateDate = (rule, value, callback) => {
			if (!value[0] || !value[1]) {
				callback(new Error("请选择试岗时间"));
			} else { callback(); }
		};

		return {
			staff: '',
			visible: false,
			changeType: [
				{ label: '待沟通', value: 0 },
				{ label: '安排面试', value: 14 },
				{ label: '实际面试', value: 13 },
				{ label: '发offer', value: 2 },
				{ label: '试岗', value: 3 },
				{ label: '待入职', value: 4 }
			],
			routerMap: {
				'0': '1',
				'13': '2',
				'2': '3',
				'3': '4',
				'4': '5',
			},
			formValidate: {
				status: this.getStatus(),
				refuse_remarks: null,
				try_start_time: '',
				interview_time: null,
				predict_entry_time: null,
			},
			ruleValidate: {
				status: [
					{ required: true, type: 'number', message: '请选择变更类型', trigger: 'change' }
				],
				interview_time: [
					{ required: true, type: 'object', message: '请选择实际面试时间', trigger: 'change' }
				],
				predict_interview_time: [
					{ required: true, type: 'object', message: '请选择预计面试时间', trigger: 'change' }
				],
				try_start_time: [
					{ required: true, type: 'array', message: '请选择试岗时间', trigger: 'change' },
					{ validator: validateDate, trigger: 'change' }
				],
				predict_entry_time: [
					{ required: true, type: 'object', message: '请选择预计入职时间', trigger: 'change' }
				]
			}
		};
	},
	computed: {
		curChangeType() {
			return this.changeType.filter((item) => item.value != this.status);
		}
	},
	mounted() {
		this.visible = true;
		this.loadStaffData();
	},
	methods: {
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
		},
		getStatus() {
			switch (this.status) {
				case 0:
					return 14;
				case 13:
					return 2;
				case 14:
					return 13;
				case 2:
					return 3;
				case 3:
					return 4;
				case 4:
					return 3;
				default:
					return '';
			}
		},
		handleOk() {
			this.$refs.formValidate.validate((valid) => {
				if (valid) {
					this.handleSave();
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		},
		handleCancel() {
			this.$emit('close');
		},
		handleChange(value, type) {
			this.formValidate[type] = value;
		},
		handleSave() {
			app.$store.dispatch("request", {
				url: "HR_RECRUIT_SOCIAL_SUMMARY_CHANGE_POST", // eslint-disable-line
				type: 'POST',
				param: {
					applicant_id: this.applicantId,
					status: this.formValidate.status,
					interview_time: moment(this.formValidate.interview_time).format("YYYY-MM-DD HH:mm"),
					predict_interview_time: moment(this.formValidate.predict_interview_time).format("YYYY-MM-DD HH:mm"),
					interviewer_ids: this.formValidate.interviewer_ids,
					try_start_time: moment(this.formValidate.try_start_time[0]).format("YYYY-MM-DD"),
					try_end_time: moment(this.formValidate.try_start_time[1]).format("YYYY-MM-DD"),
					send_offer_time: moment(this.formValidate.send_offer_time).format("YYYY-MM-DD"),
					predict_entry_time: moment(this.formValidate.predict_entry_time).format("YYYY-MM-DD"),
				}
			}).then((res) => {
				// this.$router.replace(getHashUrl('/hr/recruit/social/summary', {
				// 	...this.query,
				// 	type: this.routerMap[this.formValidate.status],
				// }));

				res.msg && this.$Message.success(res.msg);
				// this.$refs.modal.buttonLoading = false;
				this.visible = false;
				this.$emit('sure');
			}).catch((error) => {
				this.$Message.error(error.msg);
				this.$refs.modal.buttonLoading = false;
			});
		}
	}
};
export const ChangeModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.c-social-change-modal {
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
