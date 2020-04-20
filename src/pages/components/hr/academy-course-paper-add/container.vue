<template>
	<div class="v-hr-academy-course-paper-add g-hide-scroll" >
		<div class="g-flex g-flex-cc" >
			<div style="width:850px">
				<oa-across-table :data="across" mode="customer" @click-icon="handleChangeStep">
					<span/>
					<span 
						slot="side" 
						slot-scope="{item}" 
						:class="'g-m-l-5 '+((item.status==2 || item.status==4)?'g-c-blue-mid':'')" 
						@click="handleChangeStep(item)"
					>
						{{ item.title }}
					</span>
				</oa-across-table>
				<oa-step1 
					v-if="step==1" 
					ref="step1" 
					:form-data="formData"
					style="padding-bottom: 1px"
					@paper-type-change="handlePaperTypeChange"
				/>
			</div>
		</div>
		<oa-step2 
			v-if="step==2" 
			ref="step2"
			v-model="questions"
			:question-static="questionStatic" 
			show-statistic
			@to-use="handleToUse"
		/>
		<template v-if="step==3" >
			<oa-step3
				v-if="formData.paper_type === 1"
				ref="step3"
				v-model="formData.pass_score"
				:questions="questions" 
				:question-static="questionStatic"
			/>
			<div 
				v-if="formData.paper_type === 2"
				class="g-c-black2 g-fs-14 g-pd-b-10">按题型随机选择</div>
			<oa-step3-random
				v-if="formData.paper_type === 2"
				ref="step3" 
				v-model="formData.pass_score"
				:questions="questions" 
			/>

			
		</template>
		<div v-if="step!=2" class="_footer">
			<template v-if="step==1">
				<i-button @click="handleCancel">取消</i-button>
				<i-button type="primary" @click="handleNext">下一步</i-button>
			</template>
			<i-button v-else type="primary" @click="handleCreatePaper">生成试卷</i-button>
		</div>
	</div>
</template>
<script>
import { Button } from 'iview';
import { services } from '@stores/services/hr';
import AcrossTable from '@components/_common/across-table/across-table';
import Step1 from './steps/step1';
import Step2 from './steps/step2';
import Step3 from './steps/step3';
import Step3Random from './steps/step3-random';


export default {
	name: 'oa-',
	components: {
		'i-button': Button,
		'oa-across-table': AcrossTable,
		'oa-step1': Step1,
		'oa-step2': Step2,
		'oa-step3': Step3,
		'oa-step3-random': Step3Random
	},
	mixins: [services.subjectTree()],
	data() {
		const { query = {} } = this.$route;
		return {
			step: 1,
			across: [
				{
					status: 4,
					step: 1,
					title: '填写试卷信息'
				},
				{
					status: 1,
					step: 2,
					title: '从题库中选题'
				},
				{
					status: 1,
					step: 3,
					title: '生成试卷'
				}
			],
			questions: [],
			formData: {
				paper_type: query.paper_type === 'default' ? 1 : 2,
				paper_name: '',
				paper_describe: '',
				subject_id: [],
				pass_score: null
			}
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
	watch: {
		'questionStatic.allScore': function (val) {
			if (val < this.formData.pass_score) {
				this.formData.pass_score = val;
			}
		}
	},
	methods: {
		handleChangeStep(item) {
			if (item.status == 1) {
				return;
			}
			if (this.step == 1) {
				this.$refs.step1.$refs.form.validate(valid => {
					if (valid) this.step = item.step;
				});
			} else if (this.step == 2) {
				if (this.questions.length == 0) {
					this.$Message.error('请选择题目');
				} else {
					this.step = item.step;
				}
			} else {
				this.step = item.step;
			}
			
		},
		handleNext() {
			this.$refs.step1.validate().then(valid => {
				if (valid) {
					this.step = 2;
					this.across[0].status = 2;
					this.across[1].status = 4;
				}
			});

		},
		handleToUse() {
			this.across[1].status = 2;
			this.across[2].status = 4;
			this.step = 3;
		},
		async handleCreatePaper() {
			this.$refs.step3.$refs.form.validateAndScroll(async (valid) => {
				if (valid) {
					try {
						const res = await this.$request({
							url: "_HR_TRAIN_LIBRARY_PAPER_SAVE_POST",
							type: "POST",
							param: {
								...this.formData,
								subject_id: this.formData.subject_id[this.formData.subject_id.length - 1],
								question: this.hanldeGetQuestion(),
								setting: this.hanldeGetSetting() || {}
							},
							loading: false
						});
						this.$Message.success(res.msg);
						this.$router.go(-1);
					} catch (err) {
						console.error(err);
						this.$Message.error(err.msg);
					}
				} else {
					this.$Message.error('还有必填信息未填');
				}
			});
		},

		hanldeGetSetting() {
			// 随机试卷返回数据， 新建试卷不用处理
			if (this.formData.paper_type === 2) {
				const { formData: { numAndScore } } = this.$refs.step3;
				return {
					single_num: numAndScore[0].num || 0,
					single_score: numAndScore[0].score || 0,
					multiple_num: numAndScore[1].num || 0,
					multiple_score: numAndScore[1].score || 0,
					judgement_num: numAndScore[2].num || 0,
					judgement_score: numAndScore[2].score || 0,
					blanks_num: numAndScore[3].num || 0,
					blanks_score: numAndScore[3].score || 0,
					content_num: numAndScore[4].num || 0,
					content_score: numAndScore[4].score || 0
				};
			}
		},

		hanldeGetQuestion() {
			const { formData: { numAndScore } } = this.$refs.step3;
			const questionInfo = (question, index) => ({
				question_id: question.question_id,
				sort: index + 1,
				score: this.formData.paper_type === 2 
					? numAndScore[question.type - 1].score
					: question.score
			});
			return this.questions.map(questionInfo);
		},

		handleCancel() {
			this.$router.go(-1);
		},

		handlePaperTypeChange(paper_type) {
			this.$router.replace({
				path: '/hr/academy/course/paper/add',
				query: {
					...this.$route.query,
					paper_type: paper_type === 2 ? 'random' : 'default'
				}
			});
		}
	}
};
</script>
<style lang="scss">
.v-hr-academy-course-paper-add{
	height: calc(100% - 25px);
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
		// padding: 10px 16px;
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