<template>
	<!-- :handle-audit="handleAudit" -->
	<oa-basic-expand 
		v-model="detailData.isEdit"
		:detail-data="detailData"
		:handle-submit="handleSubmit"
		:type="type"
	>
		<div class="c-outline-teacher-info">
			<div v-if="detailData.isEdit || detailData.record_status == 1">
				<i-form 
					ref="formValidate" 
					:model="formValidate" 
					:rules="ruleValidate" 
					:label-width="120"
					class="g-m-t-15 g-pd-l-15"
					@submit.native.prevent>

					<i-form-item label="课程类型：" style="margin-top: -5px" >
						<span>{{ formValidate.lecture_set_name }}</span>
					</i-form-item>

					<i-form-item 
						v-if="refreash"
						:rules="{ required: true, type: 'array', min: 1, message: '请填写课程主题', trigger: 'change' }"
						label="课程主题：" 
						prop="subject"
						class="l-m-t-20 g-c-blue-mid g-pointer __special">
						<span @click="handleEditTopic">
							点击添加课题（当前{{ formValidate.subject_num }}个主题）
						</span>
					</i-form-item>

					<i-form-item label="讲课总时长：" prop="hour" class="l-m-t-20">
						<span>{{ formValidate.total_duration_time }}</span>
					</i-form-item>

					<i-form-item 
						label="是否出差："
						style="margin: -20px 0"
						prop="is_business">
						<i-radio-group v-model="formValidate.is_business">
							<i-radio :label="1">是</i-radio>
							<i-radio :label="0">否</i-radio>
						</i-radio-group>
					</i-form-item>

					<i-form-item 
						v-if="formValidate.is_business"
						prop="business_day" 
						label="出差天数：" 
						style="margin: -10px 0"
					>
						<i-input-number
							v-model="formValidate.business_day" 
							:min="1"
							:precision="0"
							:max="9"
							clearable
							style="width: 300px"
							placeholder="请输入出差天数"
						/>
						<span 
							class="g-c-black2 g-absolute __tip">天</span>
					</i-form-item>

					<i-form-item 
						label="备注：">
						<oa-limit-words
							v-model="formValidate.remark" 
							:max="200" 
							width="300px"
							placeholder="请输入备注"
						/>
					</i-form-item>

					<i-form-item
						label="记录时间：" 
						class="g-pd-b-10"
						style="margin-top: -10px">
						<span>{{ formValidate.update_time }}</span>
					</i-form-item>

				</i-form>
			</div>

			<div 
				v-else
				style="width: 880px; padding: 10px 0;">
				<i-row class="g-lh-30 g-c-black3">
					<i-col v-if="detailDataParse.audit_remark" span="3" class="g-tr g-pd-r-10">上次驳回理由：</i-col>
					<i-col v-if="detailDataParse.audit_remark" span="21" class ="g-pd-l-5">{{ detailDataParse.audit_remark }}</i-col>

					<i-col span="3" class="g-tr g-pd-r-10">课程类型：</i-col>
					<i-col span="21" class ="g-pd-l-5">{{ detailDataParse.lecture_set_name }}</i-col>

					<i-col span="3" class="g-tr g-pd-r-10">课程主题：</i-col>
					<i-col 
						span="21" 
						class ="g-pd-l-5 g-c-blue-mid  g-pointer">
						<span @click="handleCourseDetail">共有{{ detailDataParse.subject_num }}个主题</span>
					</i-col>

					<i-col span="3" class="g-tr g-pd-r-10">讲课总时长：</i-col>
					<i-col span="21" class ="g-pd-l-5">{{ detailDataParse.total_duration }}</i-col>

					<i-col span="3" class="g-tr g-pd-r-10">是否出差：</i-col>
					<i-col span="21" class ="g-pd-l-5">{{ detailDataParse.is_business }}</i-col>

					<div v-if="+detailData.is_business">
						<i-col span="3" class="g-tr g-pd-r-10">出差天数：</i-col>
						<i-col span="21" class ="g-pd-l-5">{{ detailDataParse.business_day }}</i-col>
					</div>

					<i-col span="3" class="g-tr g-pd-r-10">备注：</i-col>
					<i-col span="21" class ="g-pd-l-5">
						<oa-autotip
							:content="detailDataParse.remark"
							placement="bottom" 
							label-class=" "
							style="height: 30px"
						/>
					</i-col>

					<i-col span="3" class="g-tr g-pd-r-10" style="margin-top: -10px">记录时间：</i-col>
					<i-col span="21" class ="g-pd-l-5" style="margin-top: -10px">{{ detailDataParse.update_time }}</i-col>
				</i-row>
			</div>

		</div>
	</oa-basic-expand>
</template>

<script>
import AutoToolTip from "@common/auto-tooltip/auto-tooltip";
import { Row, Col, Form, FormItem, Select, Option, 
	Input, DatePicker, RadioGroup, Radio, InputNumber } from 'iview';
import API_ROOT from '@stores/apis/root';
import moment from 'moment';
import { Confirm } from "@components/_common/confirm/confirm";
import BasicExpand from "./basic-expend";
import { STATUS, onlineHelpLeaderInfo } from './constants';
import BasicInfoDisplay from './basic-info-display';
import { CourseTopicModal } from '../popup/course-topic-modal';
import { CourseTopicEditModal } from '../popup/edit-topic-modal';
import { OutlineTeacherModal } from '../popup/outline-modal/outline-teacher-modal';

export default {
	components: {
		"oa-basic-expand": BasicExpand,
		'oa-basic-info': BasicInfoDisplay,
		'i-row': Row,
		'i-col': Col,
		'oa-autotip': AutoToolTip,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-input': Input,
		'i-select': Select,
		'i-option': Option,
		'i-data-picker': DatePicker,
		'i-radio-group': RadioGroup,
		'i-radio': Radio,
		'i-input-number': InputNumber,
	},
	props: {
		detailData: {
			type: Object,
			required: true,
			default() {
				return {
					show: true,
					isEdit: false,
				};
			}
		},
		loadData: {
			type: Function,
			required: true
		},
		authType: {
			type: Number,
			required: true
		},
		type: {
			type: Number,
			required: true
		}
	},
	data() {
		const validateCreatedTime = (rule, value, callback) => {
			if (!value[0] && !value[1]) {
				callback('请选择对接时间');
			} else {
				callback();
			}
		};
		return {
			refreash: true,
			STATUS,
			onlineHelpLeaderInfo,
			formValidate: {
				lecture_set_name: this.detailData.lecture_set_name,
				subject: [],
				subject_num: this.detailData.subject_num || 0,
				is_business: this.detailData.is_business === undefined ? 1 : +this.detailData.is_business,
				business_day: this.detailData.business_day === undefined ? null : +this.detailData.business_day,
				remark: this.detailData.remark,
				update_time: this.detailData.update_time || '--',
				total_duration_time: this.handleParseMinute(this.detailData.total_duration || 0),
			},
			ruleValidate: {
				subject: [
					{ required: true, type: 'array', min: 1, message: '请填写课程主题', trigger: 'blur' },
					{ required: true, type: 'array', min: 1, message: '请填写课程主题', trigger: 'change' }],
				business_day: [{ required: true, type: 'number', message: '请输入出差天数', trigger: 'blur' }],
				is_business: [{ required: true, type: 'number' }]
			},

		};
	},
	computed: {
		detailDataParse() {
			return ({
				...this.detailData,
				total_duration: this.handleParseMinute(this.detailData.total_duration),
				is_business: +this.detailData.is_business ? '是' : '否',
				business_day: this.detailData.business_day + '天',
				remark: this.detailData.remark || '--'
			});
		}
	},
	watch: {
		'detailData.isEdit': function (newVal, oldVal) {
			if (newVal) {
				const {
					lecture_set_name, total_duration = 0, 
					subject_num, is_business, business_day, remark
				} = this.detailData;
				this.formValidate = {
					lecture_set_name, 
					total_duration_time: this.handleParseMinute(total_duration), 
					subject_num: +subject_num, 
					is_business: +is_business,
					business_day: +business_day, 
					remark,
					subject: [],
					update_time: this.detailData.update_time
				};
				this.loadSubjectData();
			}
		}
	},
	methods: {
		handleSubmit() {
			if ([1, 2].indexOf(this.authType) > -1 && [2, 5, 6].indexOf(this.detailData.record_status) > -1) {
				Confirm.popup({
					title: "",
					msg: "由于您是审核人，提交后数据状态将变为已通过，是否确定？",
					showIcon: true
				}).then(() => {
					this.$refs.formValidate.validate(valid => {
						if (valid) {
							this.handleSend();
						}
					});
				}).catch(error => {
					this.$Message.error(error.msg);
				});
			} else {
				this.$refs.formValidate.validate(valid => {
					if (valid) {
						this.handleSend();
					}
				});
			}
		},
		handleSend() {
			this.$request({
				url: API_ROOT._COLLEAGE_RECORD_LESSON_RECORD_ADD,
				type: "POST",
				param: {
					record_id: this.detailData.record_id,
					lesson_type: this.detailData.lesson_type,
					...this.formValidate,
					total_duration: this.handleTotalDuration(this.formValidate.subject),
					subject: this.handleParseTime(this.formValidate.subject)
				}
			}).then((res) => {
				this.detailData.record_status == 1 
							&& this.$Message.success('课程信息已提交审核，请及时上传交付表哦。');
				return this.loadData();
			}).then(() => {
				this.detailData.isEdit = false;
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleCourseDetail() {
			CourseTopicModal.popup({
				record_id: this.detailData.record_id,
				online: false
			}).then(() => {}).catch(err => {});
		},
		handleEditTopic() {
			CourseTopicEditModal.popup({
				record_id: this.detailData.record_id,
				online: false,
				subject: this.formValidate.subject
			}).then(CourseList => {
				this.formValidate.subject = CourseList;
				this.formValidate.subject_num = CourseList.length;
				this.formValidate.total_duration_time = this.handleParseMinute(this.handleTotalDuration(CourseList));
				// this.dispatch("FormItem", "on-form-change", CourseList);
				this.refreash = false;
				this.$nextTick(() => this.refreash = true);
			}).catch(err => {
			});
		},
		loadSubjectData() {
			this.$request({
				url: API_ROOT._COLLEAGE_RECORD_LESSON_SUBJECT_GET,
				param: {
					record_id: this.detailData.record_id
				},
				type: "GET"
			}).then(({ data }) => {
				this.formValidate.subject = data.map(v => ({ ...v, lecture_time: JSON.parse(v.lecture_time) }));
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		// handleAudit() {
		// 	OutlineTeacherModal.popup({
		// 		detailData: this.detailData
		// 	}).then(() => {
		// 		this.loadData();
		// 	}).catch(err => {});
		// },
		handleParseMinute(Minute) {
			const hour = Math.floor(Minute / 60);
			const minute = Math.floor(Minute % 60);
			return `${hour}时${minute}分`;
		},
		handleTotalDuration(subject) {
			return subject.reduce(
				(init, cur) => {
					const [startTime, endTime] = cur.lecture_time;
					const diffMinute = (moment(endTime).diff(moment(startTime), 'minute')) || 0;
					return init + diffMinute;
				},
				0
			);
		},
		handleParseTime(time) {
			return time.map(v => ({
				...v,
				lecture_time: JSON.stringify([
					moment(v.lecture_time[0]).format('YYYY-MM-DD HH:mm'),
					moment(v.lecture_time[1]).format('YYYY-MM-DD HH:mm')
				])
			}));
		}

	}
};
</script>

<style lang="scss">
.c-outline-teacher-info {
	.__tip {
        top: 3px;
		left: 276px;
		width: 22px;
		height: 20px;
		background: #fff;
	}
    .ivu-input-number-handler-wrap {
		display: none;
	}
    .l-m-t-20 {
        margin-top: -20px
    }
    .__special .ivu-form-item-error-tip {
        top: 80%;
    }
}
</style>
