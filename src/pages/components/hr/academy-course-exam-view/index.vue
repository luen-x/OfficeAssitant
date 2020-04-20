<template>
	<div class="v-academy-course-exam-view g-pd-t-20">
		<div class="_box">
			<div class="g-bg-red-mid g-fs-16 g-tc g-pd-tb-10 g-clearfix __title">
				<i 
					class="icon iconfont icon-fanhui g-fl g-m-l-10 g-pointer"
					@click="handleReset"
				/>
				<span>{{ paper_name }}</span>
			</div>
			<div class="__content g-m-t-20">
				<div 
					:style="`background-image: url(${OSS_EXAM_BG01});`" 
					class="__basic-info"
				>
					<div 
						class="g-flex g-fd-c g-ai-c g-pd-b-15"
						style="padding-top: 85px;"
					>
						<img 
							v-if="head_img" 
							:src="head_img" 
							alt="" 
							class="__img"
						>
						<div  
							v-else
							class="g-fs-18 g-tc __img"
							style="background-color: #e84854;line-height: 76px;"
						>
							{{ staff_name.substring(staff_name.length - 2) }}
						</div>
						<span class="g-m-t-10 g-fs-16">{{ staff_name }}</span>
					</div>
					<div class="g-m-b-30">
						<div class="__info-box">
							<div class="g-flex g-jc-sb">
								<div>
									<i-tooltip 
										v-if="exam_status === 1"
										transfer
										theme="light"
									>
										<i class="icon iconfont icon-score g-fs-12"/>
										<span class="g-lh-30 g-c-black4">目前得分 </span>
										<span 
											v-if="show_result"
											class="g-lh-30 g-c-black1 g-m-l-10"
										>
											{{ score }}分
										</span>
										<span 
											v-else 
											class="g-lh-30 g-c-black1 g-m-l-10"
										>
											--
										</span>
										<div slot="content">
											<p 
												v-for="(it, i) in right_question" 
												:key="i"
												style="line-height: 20px;"
											>
												{{ it.type_name }}：答对{{ it.success_count }}题，共得{{ it.score }}分
											</p>
										</div>
									</i-tooltip>
									<div v-else class="g-lh-30">
										<i class="icon iconfont icon-score g-fs-12"/>
										<span class="g-c-black4">目前得分 </span>
										<span 
											v-if="show_result"
											class="g-c-black1 g-m-l-10"
										>
											{{ score }}分
										</span>
										<span v-else class="g-c-black1 g-m-l-10">--</span>
									</div>
								</div>
								<div class="g-lh-30">
									<i class="icon iconfont icon-histogram g-fs-12"/>
									<span class="g-c-black4">目前排名</span>
									<span class="g-c-black1 g-m-l-10">{{ participator_rank }} 名</span>
								</div>
							</div>
							<div class="g-flex g-jc-sb">
								<div>
									<i class="icon iconfont icon-star2 g-fs-12"/>
									<span class="g-c-black4">试卷满分</span>
									<span class="g-c-black1 g-m-l-10">{{ full_score }} 分</span>
								</div>
								<div>
									<i class="icon iconfont icon-user g-fs-12"/>
									<span class="g-c-black4">参与人数</span>
									<span class="g-c-black1 g-m-l-10">{{ participator_num }} 人</span>
								</div>
							</div>
						</div>
					</div>
					<img 
						:src="exam_status_icon[exam_status]" 
						alt="" 
						class="__exam-status"
					>
					<div class="__effective">
						<div :class="{'__valid':is_effective === 1,'__invalid':is_effective === 2}">
							<div class="__txt">
								<span class="g-fs-16">{{ ['有效','无效'][+is_effective - 1] }}</span>
							</div>
						</div>
					</div>
				</div>
				<div class="__question">
					<div class="g-clearfix g-m-tb-20">
						<span class="__title-bar"/>
						<span class="g-fs-16 g-m-l-5">答题详情</span>
						<i-button 
							v-if="visible"
							type="primary" 
							class="g-fr"
							style="line-height: 15px;"
							@click="handleError"
						>
							查看错题
						</i-button>
						<i-button 
							v-else
							type="primary" 
							class="g-fr"
							@click="handleAll"
						>
							查看全部
						</i-button>
					</div>
					<div class="__list">
						<div 
							v-for="(item, index) in question" 
							:key="index"
						>
							<div 
								v-if="index === question.findIndex(it => it.type === 1)"
								class="g-c-black1 g-fs-14 g-bg-light3 g-pd-lr-15 g-pd-tb-10"
								style="border-radius: 4px;"
							>
								<span class="g-m-r-10">单选题</span>
								<span>{{ question.filter(_it => _it.type === 1).length }}道题，</span>
								<span>共{{ handleSum(question.filter(_it => _it.type === 1)) }}分</span>
							</div>
							<div 
								v-else-if="index === question.findIndex(it => it.type === 2)"
								class="g-c-black1 g-fs-14 g-bg-light3 g-pd-lr-15 g-pd-tb-10"
								style="border-radius: 4px;"
							>
								<span class="g-m-r-10">多选题</span>
								<span>{{ question.filter(_it => _it.type === 2).length }}道题，</span>
								<span>共{{ handleSum(question.filter(_it => _it.type === 2)) }}分</span>
							</div>
							<div 
								v-else-if="index === question.findIndex(it => it.type === 3)"
								class="g-c-black1 g-fs-14 g-bg-light3 g-pd-lr-15 g-pd-tb-10"
								style="border-radius: 4px;"
							>
								<span class="g-m-r-10">判断题</span>
								<span>{{ question.filter(_it => _it.type === 3).length }}道题，</span>
								<span>共{{ handleSum(question.filter(_it => _it.type === 3)) }}分</span>
							</div>
							<div 
								v-else-if="index === question.findIndex(it => it.type === 4)"
								class="g-c-black1 g-fs-14 g-bg-light3 g-pd-lr-15 g-pd-tb-10"
								style="border-radius: 4px;"
							>
								<span class="g-m-r-10">填空题</span>
								<span>{{ question.filter(_it => _it.type === 4).length }}道题，</span>
								<span>共{{ handleSum(question.filter(_it => _it.type === 4)) }}分</span>
							</div>
							<div 
								v-else-if="index === question.findIndex(it => it.type === 5)"
								class="g-c-black1 g-fs-14 g-bg-light3 g-pd-lr-15 g-pd-tb-10"
								style="border-radius: 4px;"
							>
								<span class="g-m-r-10">简答题</span>
								<span>{{ question.filter(_it => _it.type === 5).length }}道题，</span>
								<span>共{{ handleSum(question.filter(_it => _it.type === 5)) }}分</span>
							</div>
							<div class="g-flex">
								<span class="g-m-t-10 g-m-l-20">{{ item.sort }}、</span>
								<oa-answer-question
									v-model="item.staff_answer"
									:data="item" 
									:key="item.question_id"
									disabled
									exam
									style="margin-left: -15px;"
								/>
							</div>
							<div>
								<div 
									v-if="item.type == 1"
									class="g-pd-lr-20 g-pd-tb-10 g-fs-14 g-m-t-10 __explian"
								>
									<div class="g-flex g-jc-sb">
										<div class="g-c-black3">
											<span>你的回答：</span>
											<span v-if="item.staff_answer.length">
												{{ optionMap[item.option.find(it => it.option_id === item.staff_answer[0]).sort] }}
											</span>
											<span v-else>未作答</span>
											<i 
												v-if="String([...item.staff_answer].sort()) === String([...item.question_answer].sort())" 
												class="iconfont icon-selected g-pd-l-10 g-c-green-mid"
											/>
											<i 
												v-else 
												class="iconfont icon-close2 g-pd-l-10 g-c-red-mid"
											/>
										</div>
										<span class="g-c-blue-mid">
											本题得分：{{ item.question_score }}分
										</span>
									</div>
									<div class="g-c-black3">
										<span>正确回答：</span>
										<span>
											{{ optionMap[item.option.find(it => it.option_id === item.question_answer[0]).sort] }}
										</span>
									</div>
									<div v-if="show_tips">
										<div 
											v-if="item.is_success && item.success_tips" 
											class="g-c-black3"
										>
											<span>点评：</span>
											<span>{{ item.success_tips }}</span>
										</div>
										<div 
											v-else-if="!item.is_success && item.error_tips"
											class="g-c-black3"
										>
											<span>点评：</span>
											<span>{{ item.error_tips }}</span>
										</div>
									</div>
									<div 
										v-if="item.explain && show_explain" 
										class="g-c-black3"
									>
										<span>解析：</span>
										<span>{{ item.explain }}</span>
									</div>
								</div>
								<div 
									v-else-if="item.type == 2"
									class="g-pd-lr-20 g-pd-tb-10 g-fs-14 g-m-t-10 __explian"
								>
									<div class="g-flex g-jc-sb">
										<div class="g-c-black3">
											<span>你的回答：</span>
											<span v-if="item.staff_answer.length">
												<span v-for="(it, i) in item.staff_answer" :key="i">
													{{ optionMap[item.option.find(it => it.option_id === item.staff_answer[i]).sort] }}
												</span>
											</span>
											<span v-else>未作答</span>
											<i 
												v-if="String([...item.staff_answer].sort()) === String([...item.question_answer].sort())"  
												class="iconfont icon-selected g-pd-l-10 g-c-green-mid"
											/>
											<i 
												v-else 
												class="iconfont icon-close2 g-pd-l-10 g-c-red-mid"
											/>
										</div>
										<span class="g-c-blue-mid">
											本题得分：{{ item.question_score }}分
										</span>
									</div>
									<div class="g-c-black3">
										<span>正确回答：</span>
										<span v-for="(it, i) in item.question_answer" :key="i">
											{{ optionMap[item.option.find(it => it.option_id === item.question_answer[i]).sort] }}
										</span>
									</div>
									<div v-if="show_tips">
										<div 
											v-if="item.is_success && item.success_tips" 
											class="g-c-black3"
										>
											<span>点评：</span>
											<span>{{ item.success_tips }}</span>
										</div>
										<div 
											v-else-if="!item.is_success && item.error_tips"
											class="g-c-black3"
										>
											<span>点评：</span>
											<span>{{ item.error_tips }}</span>
										</div>
									</div>
									<div 
										v-if="item.explain && show_explain" 
										class="g-c-black3"
									>
										<span>解析：</span>
										<span>{{ item.explain }}</span>
									</div>
								</div>
								<div 
									v-else-if="item.type == 3"
									class="g-pd-lr-20 g-pd-tb-10 g-fs-14 g-m-t-10 __explian"
								>
									<div class="g-flex g-jc-sb">
										<div class="g-c-black3">
											<span>你的回答：</span>
											<span v-if="item.staff_answer.length">
												{{ optionMap[item.option.find(it => it.option_id === item.staff_answer[0]).sort] }}
											</span>
											<span v-else>未作答</span>
											<i 
												v-if="String([...item.staff_answer].sort()) === String([...item.question_answer].sort())"  
												class="iconfont icon-selected g-pd-l-10 g-c-green-mid"
											/>
											<i 
												v-else 
												class="iconfont icon-close2 g-pd-l-10 g-c-red-mid"
											/>
										</div>
										<span class="g-c-blue-mid">
											本题得分：{{ item.question_score }}分
										</span>
									</div>
									<div class="g-c-black3">
										<span>正确回答：</span>
										<span>
											{{ optionMap[item.option.find(it => it.option_id === item.question_answer[0]).sort] }}
										</span>
									</div>
									<div v-if="show_tips">
										<div 
											v-if="item.is_success && item.success_tips" 
											class="g-c-black3"
										>
											<span>点评：</span>
											<span>{{ item.success_tips }}</span>
										</div>
										<div 
											v-else-if="!item.is_success && item.error_tips"
											class="g-c-black3"
										>
											<span>点评：</span>
											<span>{{ item.error_tips }}</span>
										</div>
									</div>
									<div 
										v-if="item.explain && show_explain" 
										class="g-c-black3"
									>
										<span>解析：</span>
										<span>{{ item.explain }}</span>
									</div>
								</div>
								<div 
									v-else-if="item.type == 4"
									class="g-pd-lr-20 g-pd-tb-10 g-fs-14 g-m-t-10 __explian"
								>
									<div class="g-c-black3 g-flex g-jc-sb">
										<div>
											<span>你的回答：</span>
											<div v-if="item.staff_answer.length">
												<div v-for="(it, i) in item.staff_answer" :key="i">
													<span>空格{{ i+1 }}  </span>
													<span class="g-c-black1">{{ it }}</span>
												</div>
											</div>
											<span v-else>未作答</span>
										</div>
										<span 
											v-if="item.status === 2" 
											class="g-c-blue-mid"
										>
											本题得分：{{ item.question_score }}分
										</span>
									</div>
									<div class="g-c-black3 g-flex g-jc-sb">
										<div>
											<span>阅卷评分：</span>
											<span v-if="item.status === 2">
												{{ item.question_score }}分
											</span>
											<span v-else>
												待评分
											</span>
										</div>
									</div>
								</div>
								<div 
									v-else-if="item.type == 5"
									class="g-pd-lr-20 g-pd-tb-10 g-fs-14 g-m-t-20 __explian"
								>
									<div class="g-c-black3 g-flex g-jc-sb">
										<div>
											<span>参考答案：</span>
											<span>{{ item.question_answer[0] || '--' }}</span>
										</div>
									</div>
									<div class="g-c-black3 g-flex g-jc-sb">
										<div>
											<span>阅卷评分：</span>
											<span v-if="item.status === 2">
												{{ item.question_score }}分
											</span>
											<span v-else>
												待评分
											</span>
										</div>
										<span 
											v-if="item.status === 2"
											class="g-c-blue-mid"
										>
											本题得分：{{ item.question_score }}分
										</span>
									</div>
								</div>
							</div>
							<div class="g-m-tb-20 __line"/>
						</div>
						<div 
							v-if="notice_tips"
							class="g-tc g-c-black4 g-pd-b-20 g-fs-14"
						>
							{{ notice_tips }}
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
import { Button, Tooltip } from 'iview';
import API_ROOT from "@stores/apis/root";
import { OSS_EXAM_ICON01, OSS_EXAM_ICON02, OSS_EXAM_ICON03, OSS_EXAM_ICON04, OSS_EXAM_BG01, OSS_WYA_LOGO01 } from "@constants/constants";
import AnswerQuestion from '@components/_common/questions/answer-question';

export default {
	name: 'oa-academy-course-exam-view',
	components: {
		'i-button': Button,
		'i-tooltip': Tooltip,
		'oa-answer-question': AnswerQuestion
	},
	data() {
		return {
			visible: true,
			is_effective: '', // 考试结果是否有效
			paper_name: '', // 试卷名称
			head_img: '', // 用户头像
			staff_name: '', // 用户名称
			exam_status: '', // 考试状态
			score: 0, // 目前得分
			full_score: 0, // 试卷满分
			participator_rank: 0, // 目前排名
			participator_num: 0, // 参与人数
			question: [], // 题目列表
			question_temp: [], // 题目列表备份
			right_question: [], // 答对的题
			optionMap: { 1: 'A', 2: 'B', 3: 'C', 4: 'D', 5: 'E', 6: 'F', 7: 'G', 8: 'H', 9: 'I', 10: 'J' },
			exam_status_icon: { 1: OSS_EXAM_ICON04, 2: OSS_EXAM_ICON02, 3: OSS_EXAM_ICON01 },
			OSS_EXAM_BG01, // 头部背景
			OSS_WYA_LOGO01,
			scrollTop: 0,
			timer: 0,
			dParams: 20,
			scrollState: 0,
			show_explain: false, // 是否显示解析
			show_tips: false, // 是否显示点评
			show_result: false, // 是否显示考试成绩
			notice_tips: '', // 尾部提示
		};
	},
	computed: {
		showTop() {
			return this.scrollTop > 0;
		}
	},
	mounted() {
		this.loadData();
		window.addEventListener('scroll', this.getScrollTop);
	},
	methods: {
		/**
		 * 初始化加载
		 */
		loadData() {
			const { query = {} } = this.$route;
			this.visible = true;
			this.$request({
				url: API_ROOT._SALE_TRAIN_STAFF_EXAM_ANSWER_DETAIL_GET,
				type: 'GET',
				loading: false,
				param: {
					result_id: query.result_id
				},
				autoTip: false
			}).then(res => {
				this.is_effective = res.data.is_effective;
				this.show_result = res.data.show_result;
				this.show_explain = res.data.show_explain;
				this.show_tips = res.data.show_tips;
				this.notice_tips = res.data.notice_tips;
				this.paper_name = res.data.paper_name;
				this.head_img = res.data.head_img;
				this.exam_status = res.data.exam_status;
				this.staff_name = res.data.staff_name;
				this.score = res.data.score;
				this.full_score = res.data.full_score;
				this.participator_rank = res.data.participator_rank;
				this.participator_num = res.data.participator_num;
				res.data.detail.sort((i, j) => i.type - j.type);
				res.data.detail = res.data.detail.map((it, index) => ({ ...it, sort: index + 1 }));
				this.question = res.data.detail;
				this.question_temp = res.data.detail;
				this.right_question = res.data.right_question;
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		handleError() {
			this.visible = false;
			this.question = this.question.filter(it => !it.is_success);
			this.question.sort((i, j) => i.type - j.type);
			this.question = this.question.map((it, index) => ({ ...it, sort: index + 1 }));
		},
		handleAll() {
			this.visible = true;
			this.question = this.question_temp;
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
		/**
		 * 求各题型的总分
		 */
		handleSum(arr) {
			let sum = 0;
			for (let i = 0, len = arr.length; i < len; i++) {
				sum += arr[i].score;
			}
			return sum;
		},
		/**
		 * 返回
		 */
		handleReset() {
			this.$router.push('/sale/train/study');
		}
	},
};

export const AcademyCourseExamView = module.exports.default;
</script>

<style lang="scss">
.v-academy-course-exam-view {
	height: 100%;
	background-color: #fafafa;
	._box {
		width: 1050px;
		margin: 0 auto;
		border: 1px solid #e8e8e8;
		box-shadow: 0px 1px 8px 0px rgba(0, 0, 0, 0.1);
		.__title {
			border-top-left-radius: 5px;
			border-top-right-radius: 5px;
		}
		.__content {
			margin: 0 auto;
			margin-top: 20px;
			.__basic-info {
				position: relative;
				width: 85%;
				height: 346px;
				margin: 0 auto;
				border-radius: 4px;
				background-repeat: no-repeat;
				background-size:cover;
			}
			.__img {
				width: 76px;
				height: 76px;
				border-radius: 50%;
				color: #fff;
			}
			.__exam-status {
				position: absolute;
				top: 85px;
				right: 25%;
			}
			.__effective {
				width: 150px;
				position: absolute;
				top: 0;
				right: -10px;
				transform: rotate(45deg);
				.__valid,.__invalid {
					position: relative;
					width: 100%;
					height: auto;
					margin: 50px auto;
					color: #fff;
				}
				.__valid:before,.__valid:after,
				.__invalid:before,.__invalid:after {
					position: absolute;
					content: "";
					width: 100%;
					height: 100%;
					top: 0;
					transform-origin: 0 0;
					-webkit-transform-origin: 0 0;
				}
				.__valid:before,.__invalid:before {
					left: 0;
					transform: skew(-45deg);
					-webkit-transform: skew(45deg);
				}
				.__valid:after,.__invalid:after {
					right: 0;
					transform: skew(45deg);
					-webkit-transform: skew(-45deg);
				}
				.__valid:before,.__valid:after {
					background-color: #4fc43d;
				}
				.__invalid:before,.__invalid:after {
					background-color: #d4d7db;
				}
				.__txt{
					position: relative;
					text-align: center;
					z-index: 10;
					color: #fff;
					height: 30px;
					line-height: 25px;
				}
			}
			.__info-box {
				width: 300px;
				margin: 0 auto;
			}
			.__question {
				width: 85%;
				margin: 0 auto;
				.__title-bar {
					display: inline-block;
					width: 2px;
					height: 14px;
					position: relative;
					top: 2px;
					background-color: #e84854;
				}
			}
		}
		.__explian {
			background-color: #f5f5f6;
			border-radius: 4px;
		}
		.__line {
			width: 100%;
			height: 1px;
			background-color: #EBEEF1;
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
	.c-answer-question {
		margin-bottom: 0;
	}
}
</style>
