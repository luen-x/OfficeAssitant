<template>
	<div>
		<i-drawer
			ref="drawer"
			v-model="visible"
			:mask="false"
			:mask-closable="false"
			:styles="styles"
			class="v-hr-academy-train-paper-3-result-detail"
			@on-close="handleCancel"
		> 
			<div v-if="!isLoading" style="padding: 0 10px">
				<div class="g-tabs-card">
					<div class="" style="margin-top: -2px">
						<span class="g-c-black g-fs-14">本次考试时间：</span>
						<span class="g-c-black1">{{ examInfo.start_time + ' - ' + examInfo.end_time }}</span>
					</div>
					<oa-header :exam-info="examInfo" @student-change="handleContinueRead($event, false)"/>
					<oa-title class="g-m-t-15">发放设置</oa-title>
					<i-form ref="formValidate" :model="examInfo">
						<i-form-item
							:rules="{ required: true, min: 1, type: 'number', message: '请选择有效性', trigger: 'change'}"
							prop="is_effective"
							label="有效性：" 
							style="margin: 2px 0 0 15px">
							<i-radio-group v-model="examInfo.is_effective" @on-change="handleEffectiveChange" >
								<i-radio :label="1" >有效</i-radio>
								<i-radio :label="2" >无效</i-radio>
							</i-radio-group>
						</i-form-item>

						<oa-title style="margin: -5px 0 13px 0">填写信息</oa-title>
						<div class="g-c-black1 g-pd-l-15">
							<span>姓名：{{ examInfo.staff_name }}</span>
							<span style="margin-left: 40px">部门：{{ examInfo.depart_name || '--' }}</span>
							<span style="margin-left: 40px">师傅：{{ examInfo.master_name || '--' }}</span>
						</div>

						<oa-title style="margin: 20px 0 15px 0">答题详情</oa-title>
						<oa-detail-table :exam-info="examInfo"/>
			
						<i-tabs 
							:value="type" 
							:animated="false"
							type="card" 
							style="margin-top: 20px"
							@on-click="handleChange"
						>
							<i-tab-pane 
								v-for="(item) in tabs"
								:key="item.value"
								:label="item.label === '待阅' ? item.label + item.questions.length : item.label" 
								:name="item.value"
							>
								<div v-if="item.questions.length">
									<div v-for="(question, i) in item.questions" :key="i" class="g-m-b-25">
										<oa-answer-question
											:data="question"
											:index="i + 1"
											class=" g-m-b-15"/>
										<div 
											:class="[question.question_score > 0 ? 'l-bg-blue' : 'l-bg-red', 'g-m-l-15',
												{ 'l-bg-blue1': (question.type > 3 && question.status == 1) } ]"
											style="overflow: hidden; width: 606px">
											<div v-if="question.type == 1 || question.type == 2 || question.type == 3">
												<oa-auto-read :question="question" :type="type"/>
											</div>
											<div v-else-if="question.type == 4" class="g-lh-32 g-pd-l-20 g-of-h">
												<oa-read-fill-blank :question="question" :type="type" :exam-info="examInfo"/>
											</div>
											<div v-else>
												<oa-read-simple-answer :question="question" :type="type" :exam-info="examInfo"/>
											</div>
										</div>
									</div>
								</div>
								<div v-else>暂无</div>
							</i-tab-pane>
						</i-tabs>
					</i-form>
					<div class="_footer">
						<i-button 
							:disabled="nowResultIndex <= 0"
							style="display: inline-block; margin-left: 360px"
							@click="handleContinueRead('pre')">{{ type == '3' ? '保存并阅上一个' : '上一个' }}</i-button >
						<i-button 
							type="primary"
							class="g-m-l-5"
							style="display: inline-block"
							@click="handleReadPaper">{{ operateText }}</i-button>
						<i-button 
							:disabled="nowResultIndex === resultList.length - 1"
							style="display: inline-block;"
							class="g-m-l-5"
							@click="handleContinueRead('next')">{{ type == '3' ? '保存并阅下一个' : '下一个' }}</i-button >
					</div>
				</div>
			</div>
			<div v-if="isLoading">
				<oa-loading/>
			</div>
		</i-drawer>
	</div>
</template>
<script>
import { Drawer, Tabs, TabPane, RadioGroup, Radio, FormItem, Form, Button, Input } from 'iview';
import { CreatePortal } from 'wya-vc';
import Loading from '@components/_common/loading/loading';
import API_ROOT from "@stores/apis/root";
import { getParseUrl, getHashUrl } from '@utils/utils';
import oaTitle from '@components/hr/academy-train-detail/_common/title';
import AnswerQuestion from './answer-question';
import Header from '../components/header';
import DetailTable from '../components/detail-table';
import ReadFillBlank from '../components/read-fill-blank';
import ReadSimpleAnswer from '../components/read-simple-answer';
import AutoRead from '../components/auto-read';

export default {
	name: 'oa-activity-detail',
	components: {
		'i-button': Button,
		'i-drawer': Drawer,
		'i-input': Input,
		'oa-loading': Loading,
		'i-tabs': Tabs,
		'oa-title': oaTitle,
		'i-tab-pane': TabPane,
		'oa-header': Header,
		'i-radio': Radio,
		'i-radio-group': RadioGroup,
		'i-form-item': FormItem,
		'i-form': Form,
		'oa-detail-table': DetailTable,
		'oa-answer-question': AnswerQuestion,
		'oa-read-fill-blank': ReadFillBlank,
		'oa-auto-read': AutoRead,
		'oa-read-simple-answer': ReadSimpleAnswer
	},
	props: {
		examData: {
			required: true,
			type: Object
		}
	},
	data() {
		return {
			visible: false,
			styles: {
				height: 'calc(100% - 55px)',
				overflowY: 'auto',
				paddingBottom: '53px',
				position: 'static'
			},
			isLoading: false,
			type: 0, // 同tabs下的value
			examInfo: { },
			tabs: [
				{ label: '全部', value: '1', questions: [] }, 
				{ label: '已阅', value: '2', questions: [] }, 
				{ label: '待阅', value: '3', questions: [] }
			],
			resultList: [], // 阅卷上一个下一个列表
			nowResultIndex: 0
		};
	},
	computed: {
		operateText() {
			if (this.type == '2') {
				return '重新阅卷';
			} else if (this.type == '3') {
				return '保存';
			} else {
				return '阅卷';
			}
		}
	},
	beforeCreate() {
		this.Button = Button;
	},
	created() {
		this.loadData(this.examData.result_id);
		this.loadResultList();
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		loadData(result_id) {
			this.isLoading = true;
			this.$request({
				url: API_ROOT._HR_ACADEMY_TRAIN_DETAIL_PAPER_ANSWER_NEW_GET,
				type: "GET",
				param: {
					result_id
				}
			}).then(res => {
				this.isLoading = false;
				this.tabs = [
					{ label: '全部', value: '1', questions: [] }, 
					{ label: '已阅', value: '2', questions: [] }, 
					{ label: '待阅', value: '3', questions: [] }
				];
				this.tabs[0].questions.push(...res.data.detail);
				res.data.detail.forEach(question => {
					if (question.type <= 3 || question.status == 2) {
						this.tabs[1].questions.push(question);
					}
					if (question.type > 3 && question.status == 1) {
						this.tabs[2].questions.push(question);
					}
				});
				this.examInfo = {
					...res.data
				};
			});
		},
		loadResultList() {
			this.$request({
				url: API_ROOT['_HR_ACADEMY_TARAIN_DETAIL_PAPER_REAULT_NEXT_LIST_GET'],
				type: 'GET',
				param: { exam_id: this.$route.query.exam_id }
			}).then(({ data }) => {
				this.resultList = [
					...data
				];
				this.nowResultIndex = this.resultList.findIndex(v => v.result_id === this.examData.result_id);
			}).catch(err => this.$Message.error(err));
		},
		handleCancel() {
			this.$emit('close');
		},
		handleStudentChange(type) {
			
		},
		handleChange(type) {
			this.type = type;
		},
		async handleCheckForm() {
			let result = false;
			await this.$refs.formValidate.validate(valid => {
				if (valid) result = true;
			});
			return result;
		},
		handleEffectiveChange() {
			this.$request({
				url: API_ROOT._HR_ACADEMY_TRAIN_DETAIL_READ_PAPER_GET,
				type: "POST",
				param: {
					result_id: this.examData.result_id,
					question: [],
					is_effective: this.examInfo.is_effective
				}
			}).then(res => {
				this.$Message.success('设置成功');
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		async handleReadPaper() {
			let { tabs } = this;
			if (this.type == '2') {
				// 重新阅卷 
				tabs[1].questions.forEach((item, i) => {
					if (item.type == '4' || item.type == '5') {
						item.status = 1;
						tabs[2].questions.push(item);
					}
				});
				tabs[1].questions = tabs[1].questions.filter(v => v.status == 2);
				this.handleChange('3');
			} else if (this.type == '3') {
				// 保存
				const result = await this.handleCheckForm();
				if (!result) {
					this.$Message.error('请选择有效性');
					return;
				}
				const question = [];
				tabs[2].questions.forEach((item, i) => {
					if (typeof item.question_score === 'number') {
						question.push(item);
					}
				});
				return this.$request({
					url: API_ROOT._HR_ACADEMY_TRAIN_DETAIL_READ_PAPER_GET,
					type: "POST",
					param: {
						result_id: this.examData.result_id,
						question: question.map(v => ({
							question_id: v.question_id,
							score: v.question_score,
						})),
						is_effective: this.examInfo.is_effective
					}
				}).then(res => {
					this.$Message.success(res.msg);
					question.forEach(item => item.status = 2);
					tabs[1].questions.push(...question);
					tabs[2].questions = tabs[2].questions.filter(v => v.status == 1);
					return true;
				}).catch(err => {
					this.$Message.error(err.msg);
					return false;
				});
			} else {
				this.handleChange('3');
			}
		},
		async handleContinueRead(flag, isRead = true) {
			// 待阅情况下需要先提交保存 true 需要阅卷
			let isReadPaper = this.type == '3' && isRead;
			let result = true;
			this.nowResultIndex = flag === 'pre' 
				? this.nowResultIndex - 1
				: this.nowResultIndex + 1;
			if (this.nowResultIndex < 0 || this.nowResultIndex > this.resultList.length - 1) {
				this.nowResultIndex = 0;
			}
			if (isReadPaper) {
				result = await this.handleReadPaper();
			}

			// 判断是上一个下一个  还是阅卷并上一个下一个
			result && this.loadData(this.resultList[this.nowResultIndex].result_id);
		}
	},
};
export const AuditPaper = CreatePortal({
	alive: true
}, module.exports.default);
</script>
<style lang="scss">
.v-hr-academy-train-paper-3-result-detail {
    // overflow-y: auto;
	.ivu-form-item-label {
		color: #4B4F57;
		padding: 12px 12px 10px 0;
	}
	.l-c-blue {
		color: #4FC43D
	}
	.l-bg-red {
		background: rgba(232, 76, 87, 0.05);
	}
	.l-bg-blue {
		background: rgba(79,196,61,0.05);
	}
	.l-bg-blue1 {
		background: #F4FAFF
	}
	.__answer {
		width:606px;
		height:32px;
		line-height: 32px;
		padding-left: 20px;
	}
	.__answer-item {
		border-bottom: 1px solid rgba(191,191,191,1);
	}
	._footer {
		position: fixed;
		bottom: 0;
		height: 45px;
		line-height: 45px;
		margin-left: -25px;
		width: 940px;
		background-color: #fff;
		box-shadow:0px -2px 10px 0px rgba(0, 0, 0, 0.08);
	}
}
</style>

