<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		class="g-flex"
		width="400"
		@on-ok="handleOk"
		@on-cancel="handleCancel">

		<div slot="header" class="g-tc">
			{{ title }}
		</div>

		<!-- 状态变更 -->
		<div v-if="data.action === 'change'">
			<!-- 待沟通状态-变更 -->
			<div v-if="data.info.status === 1">
				<i-form
					ref="form1"
					:model="form1"
					:rules="rule1"
					:label-width="110">

					<i-form-item label="变更到：" prop="selected">
						<i-select
							v-model="form1.selected"
							transfer
							style="width: 220px;">
							<i-option
								v-for="item in list1"
								:key="item.value"
								:value="item.value">
								{{ item.label }}
							</i-option>
						</i-select>
					</i-form-item>

					<i-form-item
						v-if="form1.selected !== 12"
						label="面试结果："
						prop="interview_result">
						<i-select
							v-model="form1.interview_result"
							clearable
							transfer
							placeholder="请选择面试结果"
							style="width: 220px;"
							class="g-m-r-10">
							<i-option
								v-for="item in interResultList"
								:key="item.value"
								:value="item.value">
								{{ item.label }}
							</i-option>
						</i-select>
					</i-form-item>

					<!-- <i-form-item
						v-if="form1.selected === 2"
						label="发offer时间："
						prop="send_offer_time">
						<i-date-picker
							v-model="form1.send_offer_time"
							type="date"
							clearable
							transfer
							placeholder="请选择发offer时间"
							style="width: 220px"/>
					</i-form-item> -->

				</i-form>
			</div>

			<!-- 初步沟通-变更 -->
			<div v-if="data.info.status === 12">
				<i-form
					ref="form12"
					:model="form12"
					:rules="rule12"
					:label-width="110">

					<i-form-item label="变更到：" prop="selected">
						<i-select
							v-model="form12.selected"
							transfer
							style="width: 220px;">
							<i-option
								v-for="item in list12"
								:key="item.value"
								:value="item.value">
								{{ item.label }}
							</i-option>
						</i-select>
					</i-form-item>

					<i-form-item
						v-if="form12.selected === 8 || form12.selected === 2"
						label="面试结果："
						prop="interview_result">
						<i-select
							v-model="form12.interview_result"
							clearable
							transfer
							placeholder="请选择面试结果"
							style="width: 220px;"
							class="g-m-r-10">
							<i-option
								v-for="item in interResultList"
								:key="item.value"
								:value="item.value">
								{{ item.label }}
							</i-option>
						</i-select>
					</i-form-item>

					<!-- <i-form-item
						v-if="form12.selected === 2"
						label="发offer时间："
						prop="send_offer_time">
						<i-date-picker
							v-model="form12.send_offer_time"
							type="date"
							clearable
							transfer
							placeholder="请选择发offer时间"
							style="width: 220px"/>
					</i-form-item> -->

				</i-form>
			</div>

			<!-- 待定中-变更 -->
			<div v-if="data.info.status === 8">
				<i-form
					ref="form8"
					:model="form8"
					:rules="rule8"
					:label-width="110">

					<i-form-item label="变更到：" prop="selected">
						<i-select
							v-model="form8.selected"
							transfer
							style="width: 220px">
							<i-option
								v-for="item in list8"
								:key="item.value"
								:value="item.value">
								{{ item.label }}
							</i-option>
						</i-select>
					</i-form-item>

					<!-- <i-form-item
						v-if="form8.selected === 2"
						label="发offer时间：">
						<i-date-picker
							v-model="form8.send_offer_time"
							type="date"
							clearable
							transfer
							placeholder="请选择发offer时间"
							style="width: 220px"/>
					</i-form-item> -->

				</i-form>
			</div>

			<!-- 发offer-变更 -->
			<div v-if="data.info.status === 2">
				<i-form
					ref="form2"
					:model="form2"
					:rules="rule2"
					:label-width="110">

					<i-form-item label="变更到：" prop="selected">
						<i-select
							v-model="form2.selected"
							transfer
							style="width: 220px">
							<i-option
								v-for="item in list2"
								:key="item.value"
								:value="item.value">
								{{ item.label }}
							</i-option>
						</i-select>
					</i-form-item>

					<i-form-item
						v-if="form2.selected === 9"
						label="回复报到时间："
						prop="reply_time">
						<i-date-picker
							v-model="form2.reply_time"
							type="date"
							clearable
							transfer
							placeholder="请选择回复报到时间"
							style="width: 220px"/>
					</i-form-item>

					<i-form-item
						v-if="form2.selected === 9"
						label="车票信息：">
						<i-input
							v-model="form2.ticket.info"
							:maxlength="50"
							clearable
							placeholder="请输入车次"
							class="g-m-b-20"
							style="width: 220px"/>
						<i-date-picker
							v-model="form2.ticket.time"
							:disabled="form2.ticket.info ? false : true"
							type="datetimerange"
							clearable
							transfer
							split-panels
							format="yyyy-MM-dd HH:mm:ss"
							style="width: 220px"
							placeholder="发车时间-到站时间"/>
					</i-form-item>

				</i-form>
			</div>

			<!-- 已回复-变更 -->
			<div v-if="data.info.status === 9">
				<i-form
					ref="form9"
					:model="form9"
					:rules="rule9"
					:label-width="110">

					<i-form-item label="变更到：" prop="selected">
						<i-select
							v-model="form9.selected"
							transfer
							style="width: 220px">
							<i-option
								v-for="item in list9"
								:key="item.value"
								:value="item.value">
								{{ item.label }}
							</i-option>
						</i-select>
					</i-form-item>

					<i-form-item
						v-if="form9.selected === 10"
						label="实际报到时间："
						prop="register_time">
						<i-date-picker
							v-model="form9.register_time"
							type="date"
							clearable
							transfer
							placeholder="请选择实际报到时间"
							style="width: 220px"/>
					</i-form-item>

				</i-form>
			</div>

			<!-- 已报到-变更 -->
			<div v-if="data.info.status === 10">
				<i-form
					ref="form10"
					:model="form10"
					:rules="rule10"
					:label-width="90">

					<i-form-item label="变更到：" prop="selected">
						<i-select
							v-model="form10.selected"
							transfer
							style="width: 220px">
							<i-option
								v-for="item in list10"
								:key="item.value"
								:value="item.value">
								{{ item.label }}
							</i-option>
						</i-select>
					</i-form-item>

					<i-form-item
						v-if="form10.selected === 3"
						label="试岗时间："
						prop="try_start_time">
						<i-date-picker
							v-model="form10.try_start_time"
							type="daterange"
							clearable
							transfer
							split-panels
							placeholder="请选择试岗时间"
							style="width: 220px"/>
					</i-form-item>
				</i-form>
			</div>

			<!-- 试岗-变更 -->
			<div v-if="data.info.status === 3">
				<i-form
					ref="form3"
					:model="form3"
					:rules="rule3"
					:label-width="110">

					<i-form-item label="变更到：" prop="selected">
						<i-select
							v-model="form3.selected"
							transfer
							style="width: 220px">
							<i-option
								v-for="item in list3"
								:key="item.value"
								:value="item.value">
								{{ item.label }}
							</i-option>
						</i-select>
					</i-form-item>

					<i-form-item
						v-if="form3.selected === 4"
						label="预计入职时间："
						prop="predict_entry_time">
						<i-date-picker
							v-model="form3.predict_entry_time"
							type="date"
							clearable
							transfer
							placeholder="请选择预计入职时间"
							style="width: 220px"/>
					</i-form-item>

				</i-form>
			</div>

			<!-- 待入职-变更 -->
			<div v-if="data.info.status === 4">
				<i-form
					ref="form4"
					:model="form4"
					:rules="rule4"
					:label-width="80">

					<i-form-item label="变更到：" prop="selected">
						<i-select
							v-model="form4.selected"
							transfer
							style="width: 220px">
							<i-option
								v-for="item in list4"
								:key="item.value"
								:value="item.value">
								{{ item.label }}
							</i-option>
						</i-select>
					</i-form-item>

				</i-form>
			</div>
		</div>

		<!-- 离开 -->
		<div v-else>
			<i-form
				ref="leaveForm"
				:model="leaveForm"
				:rules="leaveRule"
				:label-width="100">

				<i-form-item label="离开时间：" prop="departure_time">
					<i-date-picker
						v-model="leaveForm.departure_time"
						type="date"
						clearable
						transfer
						placeholder="请选择离开时间"
						style="width: 220px"/>
				</i-form-item>

				<i-form-item label="离开类型：" prop="departure_type">
					<i-select
						v-model="leaveForm.departure_type"
						placeholder="请选择离开类型"
						clearable
						transfer
						style="width: 220px">
						<i-option
							v-for="item in departureList"
							:key="item.value"
							:value="item.value">
							{{ item.label }}
						</i-option>
					</i-select>
				</i-form-item>

				<i-form-item label="离开原因：" prop="departure">
					<!-- <i-select
						v-model="leaveForm.departure.departure_reason_type"
						placeholder="请选择离开原因"
						clearable
						transfer
						style="width: 220px"
						class="g-m-b-20">
						<i-option
							v-for="item in passDeparture"
							:key="item.value"
							:value="item.value">
							{{ item.label }}
						</i-option>
					</i-select> -->
					<oa-limit-words
						v-model="leaveForm.departure.departure_reason"
						:max="200"
						placeholder="请输入离开原因"
						style="width: 220px"/>
				</i-form-item>

			</i-form>
		</div>
	</i-modal>
</template>

<script>
import API_ROOT from "@stores/apis/root";
import { CreatePortal, Copy } from "wya-vc";
import { getParseUrl, getHashUrl, formatMoment, dataValidity } from "@utils/utils";
import { services, interResultList, passList } from '@stores/services/hr';
import { Cascader, Modal, Input, InputNumber, Select, Option, Form, FormItem, DatePicker } from "iview";

export default {
	name: "hr-recruit-school-summary-change",
	components: {
		"i-modal": Modal,
		"i-input": Input,
		"i-select": Select,
		"i-option": Option,
		"i-form": Form,
		'i-cascader': Cascader,
		"i-form-item": FormItem,
		"i-date-picker": DatePicker,
		"i-input-number": InputNumber,
		"vc-copy": Copy
	},
	mixins: [
		services.departAll(),
		services.passDeparture(),
		interResultList,
		passList
	],
	props: {
		data: Object
	},
	data() {
		let validateDate = (rule, value, callback) => {
			if (!value[0] || !value[1]) {
				callback(new Error("请选择试岗时间"));
			} else { callback(); }
		};
		return {
			visible: false,
			title: "",
			params: {},		// 请求携带参数
			form1: { selected: '' },
			form12: { selected: '' },
			form8: { selected: '' },
			form2: {
				selected: '',
				ticket: {
					info: '',
					time: ''
				}
			},
			form9: { selected: '' },
			form10: {
				selected: ''
			},
			form3: { selected: '' },
			form4: { selected: '' },
			leaveForm: {
				departure: {
					// departure_reason_type: '',
					departure_reason: ''
				}
			},
			rule1: {
				selected: [{ required: true, message: "请选择变更状态", pattern: /.+/, trigger: "change" }],
				interview_result: [{ required: true, message: "请选择面试结果", pattern: /.+/, trigger: "change" }],
				// send_offer_time: [{ required: true, message: "请选择发offer时间", type: 'object', trigger: "change", }]
			},
			rule12: {
				selected: [{ required: true, message: "请选择变更状态", pattern: /.+/, trigger: "change" }],
				interview_result: [{ required: true, message: "请选择面试结果", pattern: /.+/, trigger: "change" }],
				// send_offer_time: [{ required: true, message: "请选择发offer时间", type: 'object', trigger: "change", }]
			},
			rule8: {
				selected: [{ required: true, message: "请选择变更状态", pattern: /.+/, trigger: "change" }],
				interview_result: [{ required: true, message: "请选择面试结果", pattern: /.+/, trigger: "change" }],
				// send_offer_time: [{ required: true, message: "请选择发offer时间", type: 'object', trigger: "change", }]
			},
			rule2: {
				selected: [{ required: true, message: "请选择变更状态", pattern: /.+/, trigger: "change" }],
				reply_time: [{ required: true, message: "请选择回复报到时间", type: 'object', trigger: "change", }],
				ticket: {
					type: 'object',
					trigger: 'change',
					fields: {
						info: [{ validator: dataValidity, type: 'validTrainNum', trigger: 'change' }]
					}
				}
			},
			rule9: {
				selected: [{ required: true, message: "请选择变更状态", pattern: /.+/, trigger: "change" }],
				register_time: [{ required: true, message: "请选择实际报到时间", type: 'object', trigger: "change" }],
			},
			rule10: {
				selected: [{ required: true, message: "请选择变更状态", pattern: /.+/, trigger: "change" }],
				try_start_time: [
					{ required: true, message: "请选择试岗时间", type: 'array', trigger: "change" },
					{ validator: validateDate, trigger: 'change' }
				],
			},
			rule3: {
				selected: [{ required: true, message: "请选择变更状态", pattern: /.+/, trigger: "change" }],
				predict_entry_time: [{ required: true, message: "请选择预计入职时间", type: 'object', trigger: "change" }]
			},
			rule4: {
				selected: [{ required: true, message: "请选择变更状态", pattern: /.+/, trigger: "change" }],
			},
			leaveRule: {
				departure_time: [{ required: true, message: "请选择离开时间", type: 'object', trigger: "change" }],
				departure_type: [{ required: true, message: "请选择离开类型", pattern: /.+/, trigger: "change" }],
				departure: {
					type: 'object',
					required: true,
					trigger: 'change',
					fields: {
						// departure_reason_type: [{ required: true, message: "请选择离开原因", pattern: /.+/, trigger: "change" }],
						departure_reason: [{ required: true, message: "请输入离开理由", trigger: "blur" }],
					}
				}
			},
			showResult: false, // 展示面试结果标签项
			// 变更状态下拉框
			list1: [
				{ label: "初步沟通", value: 12 },
				{ label: "待定中", value: 8 },
				{ label: "发offer", value: 2 }
			],
			list12: [
				{ label: "待沟通", value: 1 },
				{ label: "待定中", value: 8 },
				{ label: "发offer", value: 2 }
			],
			list8: [
				{ label: "待沟通", value: 1 },
				{ label: "初步沟通", value: 12 },
				{ label: "发offer", value: 2 }
			],
			list2: [
				{ label: "待沟通", value: 1 },
				{ label: "初步沟通", value: 12 },
				{ label: "待定中", value: 8 },
				{ label: "已回复", value: 9 }
			],
			list9: [
				{ label: "发offer", value: 2 },
				{ label: "已报到", value: 10 }
			],
			list10: [
				{ label: "已回复", value: 9 },
				{ label: "试岗", value: 3 }
			],
			list3: [
				{ label: "已报到", value: 10 },
				{ label: "待入职", value: 4 }
			],
			list4: [
				{ label: "试岗", value: 3 }
			],
			// 试岗天数
			dayList: [
				{ label: "3", value: 3 },
				{ label: "2", value: 2 },
				{ label: "1", value: 1 },
				{ label: "其他", value: 0 }
			],
			departureList: [
				{ label: "主动离开", value: 1 },
				{ label: "被动离开", value: 2 }
			]
		};
	},
	computed: {},
	created() {
		this.visible = true;
		this.title = this.data.action === 'change' ? '变更' : '离开';

		// 初始化下拉框的默认选中值
		this.form1.selected = this.list1[0].value;
		this.form12.selected = this.list12[1].value;
		this.form8.selected = this.list8[2].value;
		this.form2.selected = this.list2[3].value;
		this.form9.selected = this.list9[1].value;
		this.form10.selected = this.list10[1].value;
		this.form3.selected = this.list3[1].value;
		this.form4.selected = this.list4[0].value;
	},
	methods: {
		sendRequest(obj) {
			app.$store.dispatch("request", {
				url: 'HR_RECRUIT_SCHOOL_CHANGE_POST',
				type: 'POST',
				param: {
					...obj,
					applicant_id: this.data.info.applicant_id
				},
				loading: false
			}).then((res) => {
				this.$refs.modal.buttonLoading = false;
				this.visible = false;
				this.$emit('sure');
			}).catch((error) => {
				this.$Message.error(error.msg);
				this.$refs.modal.buttonLoading = false;
			});
		},
		handleOk() {
			/**
             * v-model会默认被触发，要由该组件控制，给组件i-modal传值 loading: true
             */

			// 状态变更
			if (this.data.action === 'change') {
				this.$refs[`form${this.data.info.status}`].validate(valid => {
					if (valid) {
						switch (this.data.info.status) {
							case 1:		// 待沟通
								this.params.status = this.form1.selected;
								this.params.interview_result = this.form1.interview_result;
								this.params.send_offer_time = formatMoment(this.form1.send_offer_time);
								break;

							case 12:	// 初步沟通
								this.params.status = this.form12.selected;
								this.params.interview_result = this.form12.interview_result;
								this.params.send_offer_time = formatMoment(this.form12.send_offer_time);
								break;

							case 8:		// 待定中
								this.params.status = this.form8.selected;
								this.params.interview_result = this.form8.interview_result;
								this.params.send_offer_time = formatMoment(this.form8.send_offer_time);
								break;

							case 2:		// 发offer
								this.params.status = this.form2.selected;
								this.params.reply_time = formatMoment(this.form2.reply_time);
								this.params.ticket_info = this.form2.ticket.info;
								this.params.ticket_departure_time = formatMoment(this.form2.ticket.time[0], 'YYYY-MM-DD HH:mm:ss');
								this.params.ticket_arrive_time = formatMoment(this.form2.ticket.time[1], 'YYYY-MM-DD HH:mm:ss');
								break;

							case 9:		// 已回复
								this.params.status = this.form9.selected;
								this.params.register_time = formatMoment(this.form9.register_time);
								break;

							case 10:	// 已报到
								this.params.status = this.form10.selected;
								this.params.try_start_time = formatMoment(this.form10.try_start_time[0]);
								this.params.try_end_time = formatMoment(this.form10.try_start_time[1]);
								break;

							case 3:		// 试岗
								this.params.status = this.form3.selected;
								this.params.predict_entry_time = formatMoment(this.form3.predict_entry_time);
								break;

							case 4:		// 待入职
								this.params.status = this.form4.selected;
								break;

							default:
								break;
						}
						this.sendRequest(this.params);
					} else {
						this.$Message.warning('请按照提示完善表单信息');
						this.$refs.modal.buttonLoading = false;
					}
				});
			} else {
				this.$refs['leaveForm'].validate(valid => {
					if (valid) {
						this.params = {
							...this.leaveForm.departure,
							status: 11,
							departure_time: formatMoment(this.leaveForm.departure_time),
							departure_type: this.leaveForm.departure_type
						};
						this.sendRequest(this.params);
					} else {
						this.$Message.warning('请按照提示完善表单信息');
						this.$refs.modal.buttonLoading = false;
					}
				});
			}
		},
		handleCancel() {
			this.$emit("close");
		}
	}
};
export const changePModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" >
</style>
