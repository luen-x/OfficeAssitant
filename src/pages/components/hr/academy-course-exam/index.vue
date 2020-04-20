<template>
	<div class="v-academy-course-exam g-pd-t-20">
		<div class="_box">
			<div class="g-bg-red-mid g-fs-16 g-tc g-pd-tb-10 __title">
				{{ paperData.paper_name }}
			</div>
			<div class="__content g-flex g-fs-14 g-lh-30 g-pd-t-30">
				<div class="__left g-pd-l-30">
					<div
						v-if="time"
						class="g-flex g-jc-c g-ai-c g-m-b-10 g-pd-tb-5"
						style="background-color: #f5f5f6;border-radius: 4px;"
					>
						<i class="iconfont icon-clock2 g-fs-24 g-c-black3"/>
						<div class="g-tc g-m-l-20">
							<oa-count-down
								:time="lastTime"
								@autoSubmit="handleSubmit"
							/>
						</div>
					</div>
					<div
						class="g-flex g-fd-c g-ai-c"
						style="background-color: #f5f5f6;border-radius: 4px;"
					>
						<div style="color: #010101;">当前进度</div>
						<div style="margin-top: -10px;">
							<span style="color: #010101;">
								{{ getFilterQuestion(question).length }}
							</span>
							<span class="g-c-black7">/{{ question.length }}</span>
						</div>
						<i-progress
							:percent="(getFilterQuestion(question).length/question.length)*100"
							:stroke-width="5"
							status="active"
							style="margin: 0 auto;"
						/>
					</div>
					<div
						class="g-m-t-10 g-pd-10"
						style="background-color: #f5f5f6;border-radius: 4px;"
					>
						<div class="g-flex g-jc-sa" style="color: #010101;">
							<div>
								<span
									class="g-inline-block __rec __complete" />
								<span class="g-c-black1">已答</span>
							</div>
							<div>
								<span
									class="g-inline-block __rec __uncomplete" />
								<span class="g-c-black1">未答</span>
							</div>
							<div>
								<span class="g-inline-block __rec __current" />
								<span class="g-c-black1">当前</span>
							</div>
						</div>
						<div v-if="single.length" class="g-m-t-10">
							<div class="g-c-black1">单选题</div>
							<div class="g-flex g-jc-fs g-ai-fs g-fw-w">
								<span
									v-for="(item, index) in single"
									:key="index"
									:class="{
										'__complete': item.answer && item.question_id !== current.question_id,
										'__uncomplete': !item.answer,
										'__current': item.answer && item.question_id === current.question_id
									}"
									class="g-inline-block g-tc g-lh-20 g-m-r-5 g-m-b-10"
									style="width: 20px;height: 20px;"
								>
									{{ item.sort }}
								</span>
							</div>
						</div>
						<div v-if="multiple.length" class="g-m-t-10">
							<div class="g-c-black1">多选题</div>
							<div class="g-flex g-jc-fs g-ai-fs g-fw-w">
								<span
									v-for="(item, index) in multiple"
									:key="index"
									:class="{
										'__complete': item.answer && item.answer.length && item.question_id !== current.question_id,
										'__uncomplete': !item.answer || (item.answer && !item.answer.length),
										'__current': item.answer && item.answer.length && item.question_id === current.question_id
									}"
									class="g-inline-block g-tc g-lh-20 g-m-r-5 g-m-b-10"
									style="width: 20px;height: 20px;"
								>
									{{ item.sort }}
								</span>
							</div>
						</div>
						<div v-if="judgement.length" class="g-m-t-10">
							<div class="g-c-black1">判断题</div>
							<div class="g-flex g-jc-fs g-ai-fs g-fw-w">
								<span
									v-for="(item, index) in judgement"
									:key="index"
									:class="{
										'__complete': item.answer && item.question_id !== current.question_id,
										'__uncomplete': !item.answer,
										'__current': item.answer && item.question_id === current.question_id
									}"
									class="g-inline-block g-tc g-lh-20 g-m-r-5 g-m-b-10"
									style="width: 20px;height: 20px;"
								>
									{{ item.sort }}
								</span>
							</div>
						</div>
						<div v-if="fill.length" class="g-m-t-10">
							<div class="g-c-black1">填空题</div>
							<div class="g-flex g-jc-fs g-ai-fs g-fw-w">
								<span
									v-for="(item, index) in fill"
									:key="index"
									:class="{
										'__complete': item.answer && item.answer.find(i => i) && item.question_id !== current.question_id,
										'__uncomplete': !item.answer || (item.answer && item.answer.find(i => !i)),
										'__current': item.answer && item.answer.find(i => i) && item.question_id === current.question_id
									}"
									class="g-inline-block g-tc g-lh-20 g-m-r-5 g-m-b-10"
									style="width: 20px;height: 20px;"
								>
									{{ item.sort }}
								</span>
							</div>
						</div>
						<div v-if="short.length" class="g-m-t-10">
							<div class="g-c-black1">简答题</div>
							<div class="g-flex g-jc-fs g-ai-fs g-fw-w">
								<span
									v-for="(item, index) in short"
									:key="index"
									:class="{
										'__complete': item.answer && item.question_id !== current.question_id,
										'__uncomplete': !item.answer,
										'__current': item.answer && item.question_id === current.question_id
									}"
									class="g-inline-block g-tc g-lh-20 g-m-r-5 g-m-b-10"
									style="width: 20px;height: 20px;"
								>
									{{ item.sort }}
								</span>
							</div>
						</div>
					</div>
					<div class="g-tc g-m-t-20">
						<vc-debounce-click
							:tag="Button"
							type="primary"
							style="width: 100%;"
							@click="handleSubmit"
						>
							交卷
						</vc-debounce-click>
					</div>
				</div>
				<div class="__right">
					<div
						class="g-flex g-jc-sb"
						style="padding: 0 40px;"
					>
						<table border="1" cellspacing="0" style="width: 200px;">
							<tr style="height:40px;">
								<th>本次考试满分</th>
								<th>及格分数</th>
							</tr>
							<tr style="height:40px" align="center">
								<td>{{ singleScore + multipleScore + judgementScore + fillScore + shortScore }}分</td>
								<td>{{ paperData.pass_score }}分</td>
							</tr>
						</table>
						<table border="1" cellspacing="0" style="width: 520px;">
							<tr style="height:40px;">
								<th>单选题</th>
								<th>多选题</th>
								<th>判断题</th>
								<th>填空题</th>
								<th>问答题</th>
							</tr>
							<tr style="height:40px" align="center">
								<td>{{ single.length }}道，共{{ singleScore }}分</td>
								<td>{{ multiple.length }}道，共{{ multipleScore }}分</td>
								<td>{{ judgement.length }}道，共{{ judgementScore }}分</td>
								<td>{{ fill.length }}道，共{{ fillScore }}分</td>
								<td>{{ short.length }}道，共{{ shortScore }}分</td>
							</tr>
						</table>
					</div>
					<div v-if="question.length">
						<div
							v-for="(item, index) in question"
							:key="index"
							style="padding: 0 40px;"
						>
							<div
								v-if="index === question.findIndex(it => it.type === 1)"
								class="g-c-black1 g-fs-14 g-bg-light3 g-pd-lr-15 g-pd-tb-5 g-m-t-20"
								style="border-radius: 4px;"
							>
								<span class="g-m-r-10">单选题</span>
								<span>{{ question.filter(_it => _it.type === 1).length }}道题，</span>
								<span>每小题{{ item.score }}分，</span>
								<span>共{{ question.filter(_it => _it.type === 1).length * item.score }}分</span>
							</div>
							<div
								v-else-if="index === question.findIndex(it => it.type === 2)"
								class="g-c-black1 g-fs-14 g-bg-light3 g-pd-lr-15 g-pd-tb-5 g-m-t-20"
								style="border-radius: 4px;"
							>
								<span class="g-m-r-10">多选题</span>
								<span>{{ question.filter(_it => _it.type === 2).length }}道题，</span>
								<span>每小题{{ item.score }}分，</span>
								<span>共{{ question.filter(_it => _it.type === 2).length * item.score }}分</span>
							</div>
							<div
								v-else-if="index === question.findIndex(it => it.type === 3)"
								class="g-c-black1 g-fs-14 g-bg-light3 g-pd-lr-15 g-pd-tb-5 g-m-t-20"
								style="border-radius: 4px;"
							>
								<span class="g-m-r-10">判断题</span>
								<span>{{ question.filter(_it => _it.type === 3).length }}道题，</span>
								<span>每小题{{ item.score }}分，</span>
								<span>共{{ question.filter(_it => _it.type === 3).length * item.score }}分</span>
							</div>
							<div
								v-else-if="index === question.findIndex(it => it.type === 4)"
								class="g-c-black1 g-fs-14 g-bg-light3 g-pd-lr-15 g-pd-tb-5 g-m-t-20"
								style="border-radius: 4px;"
							>
								<span class="g-m-r-10">填空题</span>
								<span>{{ question.filter(_it => _it.type === 4).length }}道题，</span>
								<span>每小题{{ item.score }}分，</span>
								<span>共{{ question.filter(_it => _it.type === 4).length * item.score }}分</span>
							</div>
							<div
								v-else-if="index === question.findIndex(it => it.type === 5)"
								class="g-c-black1 g-fs-14 g-bg-light3 g-pd-lr-15 g-pd-tb-5 g-m-t-20"
								style="border-radius: 4px;"
							>
								<span class="g-m-r-10">简答题</span>
								<span>{{ question.filter(_it => _it.type === 5).length }}道题，</span>
								<span>每小题{{ item.score }}分，</span>
								<span>共{{ question.filter(_it => _it.type === 5).length * item.score }}分</span>
							</div>
							<div class="g-flex">
								<span class="g-m-t-10 g-m-l-15">{{ item.sort }}、</span>
								<oa-answer-question
									v-model="item.answer"
									:data="item"
									style="margin-left: -15px;"
									exam
									@change="handleChange($event)"
								/>
							</div>
							<div
								v-if="index !== (question.length - 1)"
								:style="(item.type ==2 || item.type == 5)
									? 'margin-top: 15px;' : (item.type == 4
								? 'margin-top: -8px;' : 'margin-top: 5px;')"
								class="__line"
							/>
						</div>
					</div>
				</div>
			</div>
			<div
				v-show="showTop"
				class="g-bg-red-mid g-tc g-fs-14 g-pointer _btn"
				@click="handleToTop"
			>
				回到顶部
			</div>
		</div>
		<div class="g-flex g-jc-c g-ai-c g-pd-tb-20">
			<img
				:src="OSS_WYA_LOGO01"
				alt=""
				style="width: 150px;"
			>
		</div>
	</div>
</template>

<script>
import { Progress, Button } from 'iview';
import API_ROOT from "@stores/apis/root";
import { OSS_WYA_LOGO01 } from '@constants/constants';
import AnswerQuestion from '@components/_common/questions/answer-question';
import { Confirm } from "@components/_common/confirm/confirm";
import { getItem, setItem, delItem } from 'wya-utils';
import { CountDown } from './count-down';


export default {
	name: 'oa-academy-course-exam',
	components: {
		'i-progress': Progress,
		'i-button': Button,
		'oa-answer-question': AnswerQuestion,
		'oa-count-down': CountDown
	},
	data() {
		return {
			hand_limit: '', // 学员是否必须答完所有题才能交卷
			single: [],
			multiple: [],
			judgement: [],
			fill: [],
			short: [],
			paperData: {},
			question: [],
			current: {}, // 当前试题对象
			exam_start_time: '', // 考试开始时间
			time: '', // 考试时长
			lastTime: 0, // 剩余考试时长
			scrollTop: 0,
			timer: 0,
			dParams: 20,
			scrollState: 0,
			OSS_WYA_LOGO01,
			diffData: {
				paper_id: this.$route.query.paper_id,
				exam_id: this.$route.query.exam_id,
				mobile: this.$global.staff.mobile
			}
		};
	},
	computed: {
		singleScore() {
			let sum = 0;
			this.single.forEach(it => {
				sum += it.score;
			});
			return sum;
		},
		multipleScore() {
			let sum = 0;
			this.multiple.forEach(it => {
				sum += it.score;
			});
			return sum;
		},
		judgementScore() {
			let sum = 0;
			this.judgement.forEach(it => {
				sum += it.score;
			});
			return sum;
		},
		fillScore() {
			let sum = 0;
			this.fill.forEach(it => {
				sum += it.score;
			});
			return sum;
		},
		shortScore() {
			let sum = 0;
			this.short.forEach(it => {
				sum += it.score;
			});
			return sum;
		},
		showTop() {
			return this.scrollTop > 0;
		},
	},
	beforeCreate() {
		/**
		 * 这样不会被注册监听
		 */
		this.Button = Button;
	},
	mounted() {
		const examInfo = this.getExamInfo();
		if (examInfo && (
			(examInfo.examId != this.$route.query.exam_id)
			|| (examInfo.paperId != this.$route.query.paper_id)
			|| (examInfo.mobile != this.$global.staff.mobile)

		)) {
			this.clearExamInfo();
		}
		this.loadData();
		window.addEventListener('scroll', this.getScrollTop);
		window.addEventListener('unload', this.setExamInfo);
	},
	beforeDestroy() {
		window.removeEventListener('scroll', this.getScrollTop);
		window.removeEventListener('unload', this.setExamInfo);
		this.setExamInfo();

	},
	methods: {
		/**
		 * 初始化加载
		 */
		loadData() {
			const { query = {} } = this.$route;

			this.$request({
				url: API_ROOT._SALE_TRAIN_STAFF_EXAM_DETAIL_GET,
				type: 'GET',
				loading: false,
				param: {
					exam_id: query.exam_id,
					paper_id: query.paper_id
				},
				autoTip: false
			}).then(res => {
				if (res.data.result_id) { // 	如果有result_id说明已经提交过试卷了，跳转到考试详情
					this.$router.push({
						name: 'hr-academy-course-exam-view',
						query: {
							result_id: res.data.result_id
						}
					});
					this.clearExamInfo();
					return;
				}
				const examInfo = this.getExamInfo();

				if (examInfo) {
					res.data.question.forEach(que => {
						const exist = examInfo.answers.find(ans => ans.question_id == que.question_id);
						if (exist) {
							que.answer = exist.answer;
						}
					});
					// 秒
					this.lastTime = (res.data.time * 60 - (res.data.current_time - examInfo.starTime));
				} else {
					this.setExamInfo(res.data.current_time);
					this.lastTime = res.data.time * 60;
				}
				res.data.question.sort((i, j) => {
					const noSameType = i.type - j.type;
					if (noSameType !== 0) return noSameType;
					else return i.sort - j.sort;
				});
				res.data.question = res.data.question.map((it, index) => ({ ...it, sort: index + 1 }));
				this.paperData = res.data;
				this.question = res.data.question;
				if (this.lastTime <= 0 && res.data.time > 0) {
					this.handleSubmit(true);
				}
				this.hand_limit = res.data.hand_limit;
				this.exam_start_time = res.data.exam_start_time;
				this.time = res.data.time;
				this.single = res.data.question.filter(it => it.type == 1);
				this.multiple = res.data.question.filter(it => it.type == 2);
				this.judgement = res.data.question.filter(it => it.type == 3);
				this.fill = res.data.question.filter(it => it.type == 4);
				this.short = res.data.question.filter(it => it.type == 5);
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		/**
		 * 监听试题答案的change事件
		 */
		handleChange(obj) {
			this.current = obj;
		},
		getFilterQuestion(list) {
			let temp = [];
			temp = list.filter(it => {
				if (it.answer === undefined) return false;

				if (it.type === 4) {
					return it.answer.length && it.answer.find(i => i);
				} else {
					return Array.isArray(it.answer) ? it.answer.length : it.answer;
				}
			});
			return temp;
		},
		/**
		 * 提交试卷
		 */
		handleSubmit(auto_submit) {
			const { query = {} } = this.$route;

			let question = this.getFilterQuestion([...this.question]).map(it => ({
				question_id: it.question_id,
				answer: (Array.isArray(it.answer) ? it.answer : [it.answer])
			}));

			if (typeof (auto_submit) == 'boolean' && auto_submit) {
				this.handleExam(question);
			} else if (this.hand_limit) {
				if (question.length !== this.question.length) {
					Confirm.popup({
						title: '提示',
						okText: '知道了',
						cancelText: '',
						msg: '你还有题目没有回答，必须答完才能提交！',
						showBtn: true
					}).catch((error) => {
						console.error(error);
					});
				} else {
					this.handleExam(question);
				}
			} else if (!this.hand_limit) {
				if (question.length !== this.question.length) {
					Confirm.popup({
						title: '提示',
						msg: '你还有题目没有回答，确定要提交？',
						showBtn: true
					}).then(res => {
						this.handleExam(question);
					}).catch((error) => {
						console.error(error);
					});
				} else {
					this.handleExam(question);
				}
			}
		},
		handleExam(question) {
			const { query = {} } = this.$route;
			this.$request({
				url: API_ROOT._SALE_TRAIN_STAFF_EXAM_SAVE_POST,
				type: "POST",
				loading: false,
				param: {
					exam_id: query.exam_id,
					paper_id: this.paperData.paper_id,
					start_time: this.paperData.exam_start_time,
					question
				},
				autoTip: true
			}).then(res => {
				this.clearExamInfo();
				this.submited = true;
				setTimeout(() => {
					this.$router.push({
						name: 'hr-academy-course-exam-view',
						query: {
							result_id: res.data.result_id
						}
					});
				}, 300);
			}).catch(error => {});
		},
		handleToTop(e) {
			if (this.scrollState) {
				return;
			}
			this.scrollState = 1;
			e.preventDefault();
			let distance = document.documentElement.scrollTop || document.body.scrollTop;
			let _this = this;
			this.timer = setInterval(function () {
				_this.gotoTop(_this.scrollTop - _this.dParams);
			}, 10);
		},
		gotoTop(distance) {
			this.dParams += 20;
			distance = distance > 0 ? distance : 0;
			document.documentElement.scrollTop = distance;
			document.body.scrollTop = distance;
			window.pageYOffset = distance;
			if (this.scrollTop < 10) {
				clearInterval(this.timer);
				this.dParams = 20;
				this.scrollState = 0;
			}
		},
		getScrollTop() {
			this.scrollTop = window.pageYOffset
			|| document.documentElement.scrollTop
			|| document.body.scrollTop;
		},
		setExamInfo(starTime) {
			if (this.submited || this.paperData.result_id) {
				this.clearExamInfo();
				return;
			} // 如果已经提交过了就不保存了
			// 过滤Event
			if (typeof starTime !== 'number') {
				starTime = undefined;

			}
			if (!starTime) {
				starTime = (this.getExamInfo() || {}).starTime || 0;
			}
			const examInfo = {
				examId: this.diffData.exam_id,
				paperId: this.diffData.paper_id,
				mobile: this.diffData.mobile,
				starTime,
				answers: this.question.map((que) => {
					let answer = que.answer;
					return { question_id: que.question_id, answer: que.answer };
				})
			};
			setItem("exam_info" + _global.version, examInfo, 'localStorage');
		},
		getExamInfo() {
			return getItem("exam_info" + _global.version, 'localStorage');
		},
		clearExamInfo() {
			delItem("exam_info" + _global.version, 'localStorage');
		},
		checkTimeOver() {
			this.start_time;
		}
	},
};

export const AcademyCourseExam = module.exports.default;
</script>

<style lang="scss">
.v-academy-course-exam {
	height: 100%;
	background-color: #fafafa;
	._box {
		margin: 0 auto;
		width: 1050px;
		height: 100%;
		border: 1px solid #e8e8e8;
		box-shadow: 0px 1px 8px 0px rgba(0, 0, 0, 0.1);
		.__title {
			border-top-left-radius: 5px;
			border-top-right-radius: 5px;
		}
		.__content {
			width: 100%;
			margin: 0 auto;
			padding-bottom: 80px;
			background-color: #fff;
			.__left {
				width: 22%;
				background-color: #fff;
			}
			.__right {
				width: 78%;
				background-color: #fff;
				table, table tr th, table tr td {
					border: 1px solid #D9DCE0;
					border-collapse: collapse;
					font-size: 12px;
					padding: 0 12px;
					border-radius: 4px;
				}
				table tr th {
					background-color: #F0F4FC;
				}
			}
			.__rec {
				width: 10px;
				height: 10px;
				border-radius: 2px;
			}
			.__complete {
				background-color: rgba(129,135,148,0.2);
				color: #EBEEF1;
				border-radius: 2px;
			}
			.__uncomplete {
				background-color: rgba(232,76,87,0.2);
				color: #E84C57;
				border-radius: 2px;
			}
			.__current {
				background-color: rgba(35,151,249,0.2);
				color: #2397F9;
				border-radius: 2px;
			}
			.__line {
				width: 100%;
				height: 1px;
				background-color: #EBEEF1;
			}
		}
	}
	._btn {
		position: fixed;
		width: 20px;
		height: 90px;
		bottom: 80px;
		left: 50%;
		border-radius: 4px;
		padding-top: 3px;
		margin-left: 540px;
	}
	.ivu-progress-bg {
		background-color: #CFD5E2;
	}
	.ivu-progress-inner {
		background-color: #fff;
	}
	.ivu-progress-outer {
		padding: 0 10px;
	}
	.ivu-progress-text-inner {
		color: #f0f4fd;
	}
	.c-answer-question {
		margin-bottom: 0;
	}
}
</style>
