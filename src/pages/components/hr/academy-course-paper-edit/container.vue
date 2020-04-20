<template>
	<div class="v-hr-academy-course-paper-edit g-pd-lr-20">
		<oa-step1 
			ref="step1" 
			:form-data="formData" 
			:origin-name="originName"
			style="background:#fff;position:relative;left:-36px"
		/>
		<oa-step3 
			v-if="formData.paper_type === 1"
			ref="step3" 
			v-model="formData.pass_score"
			:questions="questions" 
			:question-static="questionStatic"
		/>
		<oa-step3-random
			v-else
			ref="step3"
			v-model="formData.pass_score"
			:questions="questions"
			:num-and-score="numAndScore"
		/>
		<div class="g-m-t-20">
			<oa-filter 
				:paper-id="formData.paper_id" 
				:handle-check="handleCheckStep3Valid"
				@select-question="handleSelectQuestion"
			/>
			<oa-list 
				:paper-id="formData.paper_id"
				:paper_type="formData.paper_type" 
				@change="loadQuestionOnly" />
		</div>
		<div class="_footer">
			<i-button @click="handleCancel">取消</i-button>
			<i-button type="primary" @click="handleSave">保存</i-button>
		</div>	
	</div>
</template>
<script>
import { Input, Button } from 'iview';
import { setData } from '@components/sale/_common/util';
import { Confirm } from '@common/confirm/confirm';
import { services } from '@stores/services/hr';
import Step1 from '../academy-course-paper-add/steps/step1';
import Step2 from '../academy-course-paper-add/steps/step2';
import Step3 from '../academy-course-paper-add/steps/step3';
import Step3Random from '../academy-course-paper-add/steps/step3-random';
import Filter from './filter';
import List from './list';
import { SetScore } from '../_common/academy-course/modals/set-score';
import { findTreePath } from '../_common/academy-course/util';

export default {
	name: 'oa-',
	components: {
		'i-input': Input,
		'i-button': Button, 
		'oa-step1': Step1,
		'oa-step2': Step2,
		'oa-step3': Step3,
		'oa-step3-random': Step3Random,
		'oa-filter': Filter,
		'oa-list': List,
	},
	mixins: [services.subjectTree()],
	data() {
		const { query = {} } = this.$route;
		return {
			questions: [],
			formData: {
				paper_id: this.$route.query.paper_id,
				paper_type: Number(query.paper_type),
				paper_name: '',
				paper_describe: '',
				subject_id: [],
				pass_score: null
			},
			originName: '',
			numAndScore: [
				{ type: 1, type_name: '单选题', max_num: 0, num: null, score: null },
				{ type: 2, type_name: '多选题', max_num: 0, num: null, score: null },
				{ type: 3, type_name: '判断题', max_num: 0, num: null, score: null },
				{ type: 4, type_name: '填空题', max_num: 0, num: null, score: null },
				{ type: 5, type_name: '简答题', max_num: 0, num: null, score: null }
			]
		};
	},
	computed: {
		questionStatic() {
			const target = {
				'1': { num: 0, score: 0, },
				'2': { num: 0, score: 0, },
				'3': { num: 0, score: 0, },
				'4': { num: 0, score: 0, },
				'5': { num: 0, score: 0, },
				allScore: 0,
				allNum: 0
			};
			this.questions.forEach(que => {
				target[que.type].num++;
				target[que.type].score += que.score;
				target.allNum++;
				target.allScore += que.score;
			});
			return target; 
		}
	},
	created() {
		this.loadData();
	},
	methods: {
		loadData() {
			this.loadPaperInfo();
		},
		handleSave() {
			// if (this.formData.pass_score === null) {
			// 	this.$Message.error('请输入及格分数');
			// 	return;
			// }
			this.$refs.step3.$refs.form.validateAndScroll(async (valid) => {
				if (valid) {
					if (this.formData.pass_score > this.questionStatic.allScore) {
						this.$Message.error("及格分数不能大于总分");
						return;
					}
					try {
						const res = await this.$request({
							url: "_HR_TRAIN_LIBRARY_PAPER_UPDATE_POST",
							type: "POST",
							param: {
								...this.formData,
								subject_id: this.formData.subject_id[this.formData.subject_id.length - 1] || '',
								question: [], // 编辑时不需要传题目，
								setting: this.hanldeGetSetting() || {}
							},
							loading: false,
						});
						this.$Message.success(res.msg);
						this.$router.push('/hr/academy/course/paper');
					} catch (err) {
						console.error(err);
						this.$Message.error(err.msg);
					}
				} else {
					this.$Message.error('请输入正确信息奥~');
				}
			});
		},
		handleCancel() {
			Confirm.popup({ msg: '你编辑的内容尚未保存，是否需要保存？' }).then(() => {
				this.handleSave();
			}).catch(() => {
				this.$router.push('/hr/academy/course/paper');
			});

		},
		loadPaperInfo() {
			this.$request({
				url: "_HR_TRAIN_LIBRARY_PAPER_INFO_GET",
				type: "GET",
				param: {
					paper_id: this.formData.paper_id
				},
				loading: false,
			}).then(async res => {
				await this.loadSubjectTreePromise;
				setData(this.formData, res.data);
				this.formData.subject_id = findTreePath(this.formData.subject_id, this.subjectTree) || [];
				this.formData.pass_score = +res.data.pass_score;
				this.questions = res.data.question;
				this.originName = this.formData.paper_name;
				if (this.formData.paper_type === 2) {
					this.handleInitSetting(res.data.setting);
				}
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},
		loadQuestionOnly() {
			this.$request({
				url: "_HR_TRAIN_LIBRARY_PAPER_INFO_GET",
				type: "GET",
				param: {
					paper_id: this.formData.paper_id
				},
				loading: false,
			}).then(res => {
				this.questions = res.data.question;
			}).catch((res) => {
				this.$Message.error(res.msg);
			});

		},
		async handleSelectQuestion(ques) {
			if (ques.length == 0) return;
			this.$request({
				url: "_HR_ACADEMY_COURSE_PAPER_QUESTION_ADD_POST",
				type: "POST",
				param: {
					paper_id: this.$route.query.paper_id,
					question: this.hanldeGetQuestion(ques)
				},
				loading: false,
			}).then(res => {
				this.$Message.success(res.msg);
				this.$store.commit('HR_ACADEMY_COURSE_PAPER_EDIT_LIST_INIT');
				this.loadQuestionOnly();
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},

		hanldeGetQuestion(questions) {
			const questionInfo = (question, index) => ({
				question_id: question.question_id,
				sort: index + this.questions.length + 2, // 这个2可以换成任意大于0数字， 保证sort变大即可
				score: this.formData.paper_type === 2 
					? this.numAndScore[question.type - 1].score
					: question.score
			});
			return questions.map(questionInfo);
		},

		handleInitSetting(setting) {
			const { single_num, multiple_num, judgement_num, blanks_num, content_num,
				single_score, multiple_score, judgement_score, blanks_score, content_score } = setting;
			const settingObj = [
				{ num: single_num, score: single_score },
				{ num: multiple_num, score: multiple_score },
				{ num: judgement_num, score: judgement_score },
				{ num: blanks_num, score: blanks_score },
				{ num: content_num, score: content_score }
			];
			this.numAndScore = this.numAndScore.map((v, i) => ({
				...v,
				num: (settingObj[i].num || settingObj[i].num === 0) ? settingObj[i].num : null,
				score: (settingObj[i].score || settingObj[i].score === 0) ? settingObj[i].score : null
			}));
		},

		async handleCheckStep3Valid() {
			if (this.formData.paper_type === 2) {
				return this.$refs.step3.$refs.form.validateAndScroll(valid => {
					if (valid) {
						return true;
					} else {
						this.$Message.error('请先完善随机试卷表格信息');
						return false;
					}
				});
			} else {
				return true;
			}
		},

		hanldeGetSetting() {
			// 随机试卷返回数据， 新建试卷不用处理
			if (this.formData.paper_type === 2) {
				const { formData: { numAndScore } } = this.$refs.step3;
				return {
					single_num: numAndScore[0].num,
					single_score: numAndScore[0].score,
					multiple_num: numAndScore[1].num,
					multiple_score: numAndScore[1].score,
					judgement_num: numAndScore[2].num,
					judgement_score: numAndScore[2].score,
					blanks_num: numAndScore[3].num,
					blanks_score: numAndScore[3].score,
					content_num: numAndScore[4].num,
					content_score: numAndScore[4].score
				};
			}
		},
	}
};
</script>
<style lang="scss">
.v-hr-academy-course-paper-edit{
	height: calc(100% - 35px);
    overflow-y: auto;
	margin-top: -6px;
	._footer {
		width: calc(100% - 160px);
		height: 45px;
		line-height: 45px;
		position: fixed;
		bottom: 0;
		left: 160px;
		box-shadow: 0 -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
		padding: 10px 16px;
		background: #fff;
		.ivu-btn {
			margin-left: 5px;
			margin-right: 5px;
		}
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.c-across-table{
		._item{
			width: 300px;
			height:50px;
		}
		._line {
			left:210px;
			width:177px
		}
	}


}
</style>