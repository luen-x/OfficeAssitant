<template>
	<!-- :handle-audit="handleAudit" -->
	<oa-basic-expand 
		v-model="detailData.isEdit"
		:detail-data="detailData"
		:handle-submit="handleSubmit"
		:type="type"
	>
		<div class="c-online-teacher-info">
			<div v-if="detailData.isEdit || detailData.record_status == '1'">
				<i-form 
					ref="formValidate"
					:model="formValidate" 
					:rules="ruleValidate" 
					:label-width="120"
					class="g-m-t-15 g-pd-l-15"
					@submit.native.prevent
				>
					<i-form-item 
						v-if="formValidate.audit_remark" 
						label="上次驳回理由：" 
						style="margin-top: -5px"
					>
						<span>{{ formValidate.audit_remark }}</span>
					</i-form-item>

					<i-form-item 
						:style="{'margin-top': formValidate.audit_remark ? '-15px' : '-5px'}" 
						label="套系名称："
					>
						<span>{{ formValidate.lecture_set_name }}</span>
					</i-form-item>

					<i-form-item 
						:key="topicKey"
						label="课程主题："
						prop="subject_num" 
						class="l-m-t-20 g-c-blue-mid g-pointer"
					>
						<span @click="handleEditTopic">
							点击添加主题（当前{{ formValidate.subject_num }}个主题）
						</span>
					</i-form-item>

					<i-form-item 
						label="课时数：" 
						prop="class_hours_times" 
						class="l-m-t-20"
					>
						<span>{{ +formValidate.class_hours_times ? formValidate.class_hours_times + '节' : '--' }}</span>
					</i-form-item>

					<i-form-item 
						label="备注："
						style="margin-top: -10px"
					>
						<oa-limit-words
							v-model="formValidate.remark" 
							:max="200" 
							width="300px"
							placeholder="请输入备注"
						/>
					</i-form-item>

					<i-form-item
						v-if="formValidate.update_time"
						label="记录时间：" 
						class="g-pd-b-10"
						style="margin-top: -10px"
					>
						<span>{{ formValidate.update_time }}</span>
					</i-form-item>
				</i-form>
			</div>

			<div 
				v-else
				style="width: 880px; padding: 10px 0;">
				<i-row class="g-lh-30 g-c-black3">
					<i-col v-if="detailData.audit_remark" span="3" class="g-tr g-pd-r-10">上次驳回理由：</i-col>
					<i-col v-if="detailData.audit_remark" span="21" class ="g-pd-l-5">
						{{ detailData.audit_remark }}
					</i-col>

					<i-col span="3" class="g-tr g-pd-r-10">套系名称：</i-col>
					<i-col span="21" class ="g-pd-l-5">
						{{ detailData.lecture_set_name }}
					</i-col>

					<i-col span="3" class="g-tr g-pd-r-10">课程主题：</i-col>
					<i-col 
						span="21" 
						class ="g-pd-l-5 g-c-blue-mid  g-pointer"
					>
						<span @click="handleCourseDetail">
							共有{{ detailData.subject_num }}个主题
						</span>
					</i-col>

					<i-col span="3" class="g-tr g-pd-r-10">课时数：</i-col>
					<i-col span="21" class ="g-pd-l-5">
						{{ detailData.class_hours_times }}节
					</i-col>

					<i-col span="3" class="g-tr g-pd-r-10">备注：</i-col>
					<i-col span="21" class ="g-pd-l-5">
						<oa-autotip
							:content="detailData.remark || '--'"
							placement="bottom" 
							label-class=" "
							style="height: 30px"
						/>
					</i-col>

					<i-col span="3" class="g-tr g-pd-r-10">记录时间：</i-col>
					<i-col span="21" class ="g-pd-l-5">
						{{ detailData.update_time }}
					</i-col>
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
import { OnlineTeacherModal } from '../popup/online-audit/online-teacher-modal';

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
					record_status: 1,
				};
			}
		},
		authType: {
			type: Number,
			required: true
		},
		loadData: {
			type: Function,
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
			STATUS,
			onlineHelpLeaderInfo,
			topicKey: 0,
			formValidate: {
				subject: [],
				audit_remark: this.detailData.audit_remark,
				lecture_set_name: this.detailData.lecture_set_name,
				subject_num: Number(this.detailData.subject_num) || 0,
				remark: this.detailData.remark,
				class_hours_times: this.detailData.class_hours_times || 0,
				update_time: this.detailData.update_time || '--'
			},
			ruleValidate: {
				subject_num: [
					{ required: true, type: 'number', min: 1, message: '请填写课程主题', trigger: 'blur' },
					{ required: true, type: 'number', min: 1, message: '请填写课程主题', trigger: 'change' }]
			}
		};
	},
	watch: {
		'detailData.isEdit': function (newVal, oldVal) {
			if (newVal) {
				const {
					lecture_set_name, subject_num, 
					class_hours_times = 0, remark
				} = this.detailData;
				this.formValidate = {
					...this.formValidate,
					lecture_set_name,
					subject_num: +subject_num,
					class_hours_times,
					remark,
					subject: []
				};
				this.loadSubjectData();
			}
		}
	},
	methods: {
		loadSubjectData() {
			this.$request({
				url: API_ROOT._COLLEAGE_RECORD_LESSON_SUBJECT_GET,
				param: {
					record_id: this.detailData.record_id
				},
				type: "GET"
			}).then(({ data }) => {
				this.formValidate.subject = data;
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
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
					subject: this.formValidate.subject.map(v => ({
						...v, 
						lecture_time: moment(v.lecture_time).format('YYYY-MM-DD HH:mm')
					}))
				}
			}).then((res) => {
				return this.loadData();
			}).then(() => {
				this.detailData.isEdit = false;
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleCourseDetail() {
			CourseTopicModal.popup({
				record_id: this.detailData.record_id
			}).then(() => {}).catch(err => {});
		},
		handleEditTopic() {
			CourseTopicEditModal.popup({
				record_id: this.detailData.record_id,
				subject: this.formValidate.subject
			}).then((res) => {
				this.formValidate.subject = res;
				this.formValidate.subject_num = res.length;
				this.formValidate.class_hours_times = res.length;
				this.topicKey++;
			}).catch(err => {});
		}
		// handleAudit() {
		// 	OnlineTeacherModal.popup({
		// 		detailData: this.detailData
		// 	}).then(() => {
		// 		this.loadData();
		// 	}).catch(err => {});
		// }
	}
};
</script>

<style lang="scss">
.c-online-teacher-info {
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
    .ivu-form-item-error-tip {
        top: 80%;
    }
}
</style>
