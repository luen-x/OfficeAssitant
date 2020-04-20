<template>
	<div class="v-hr-train-draw-edit-add-draw">
		<div class="_alert g-fs-14">
			<i class="icon iconfont icon-attention g-c-red-dark"/>
			<span class="g-c-red-mid">
				提醒：{{ canEdit ? '如有人参与抽奖后，将再无法进行编辑！': '已经有人参与抽奖，无法进行编辑！' }}
			</span>
		</div>
		<i-form 
			ref="formValidate" 
			:model="formValidate" 
			:rules="ruleValidate" 
			:label-width="100">
			<i-form-item label="抽奖形式：" style="margin-top: 10px">
				<span class="g-c-black3">现场滚动抽奖</span>
			</i-form-item>

			<i-form-item label="关联事项：" style="margin-top: -20px" class="__star">
				<span class="g-c-blue-mid g-pointer" @click="hadleRelatedMaster">关联事项</span>
				<span class=" g-pd-l-10">{{ relation_label }}</span>
			</i-form-item>
			<i-form-item class="__line"/>
			<oa-title style="margin-top: -5px">发放设置</oa-title>

			<i-form-item
				label="抽奖名称：" 
				prop="lottery_topic"
				style="margin-top: 12px">
				<i-input
					v-model="formValidate.lottery_topic" 
					:maxlength="10"
					clearable
					style="width: 300px"
					placeholder="请填写抽奖名称"
				/>
			</i-form-item>

			<i-form-item label="抽奖说明：">
				<oa-limit-words
					v-model="formValidate.lottery_describe" 
					clearable
					style="width: 300px"
					placeholder=" 请输入抽奖说明，表示其抽奖的目的等"
				/>
			</i-form-item>

			<oa-title style="margin-top: -5px">奖项</oa-title>
			<i-form-item label="奖项数：" prop="lottery_num" class="g-m-t-10">
				<i-select
					v-model="formValidate.lottery_num"
					clearable
					placeholder="请选择奖项数"
					style="width: 300px"
					@on-change="hanldeLotteryReward"
				>
					<i-option
						v-for="num in 10"
						:value="num"
						:key="num">{{ num }}</i-option>
				</i-select>
				<div class="__lottery-reward">
					<div 
						v-for="(reword, i) in formValidate.lottery_reward"
						:key="i"
						class="__lottery-item">
						<div class="__title">奖项{{ NAME[i] }}：</div>
						<div class="__content">
							<div class="__left">
								<i-form-item title="建议上传1:1像素图片">
									<vc-imgs-picker
										v-model="reword.rewardImage" 
										:max="1" 
										class="g-m-t-10"
										@error="handleError"/>
								</i-form-item>
							</div>
							<div class="__right">
								<i-form-item 
									:label-width="50"
									:prop="'lottery_reward.' + i + '.reward_name'" 
									:rules="ruleValidate.reward_name"
									class="__hide-require"
									label="奖品">
									<i-input
										v-model="reword.reward_name" 
										:maxlength="16"
										clearable
										style="width: 300px"
										placeholder="请输入奖品名称"
									/>
								</i-form-item>

								<i-form-item 
									:label-width="50"
									:prop="'lottery_reward.' + i + '.reward_num'" 
									:rules="ruleValidate.reward_num"
									label="数量" 
									class="__hide-require">
									<i-input-number
										v-model="reword.reward_num" 
										:min="0"
										:max="1000"
										:precision="0"
										clearable
										style="width: 300px"
										placeholder="请输入奖品数量"
									/>
									<span 
										class="g-c-black2 g-absolute __tip">个</span>
								</i-form-item>
							</div>
						</div>
					</div>
				</div>
			</i-form-item>
			
			<i-form-item prop="user_num" label="参与抽奖：">
				<i-input-number
					v-model="formValidate.user_num" 
					:min="1"
					:precision="0"
					:max="99999999"
					clearable
					style="width: 300px"
					placeholder="请输入可参与抽奖的人数"
				/>
				<span 
					class="g-c-black2 g-absolute __tip2">人</span>
			</i-form-item>

			<i-form-item prop="times_limit" label="每人能抽：">
				<i-input-number
					v-model="formValidate.times_limit" 
					:min="1"
					:precision="0"
					:max="9999"
					clearable
					style="width: 300px"
					placeholder="请输入每人能抽奖的次数"
				/>
				<span class="g-c-black2 g-absolute __tip2">次</span>
			</i-form-item>
			<div class=" __probabilit">
				<span class="g-c-red-mid" >中奖率：{{ lotteryProbability }}%</span>
				<i-poptip 
					trigger="hover"
					placement="bottom-start"
					padding="15px 20px"
				>
					<div slot="content" class="g-c-black2">
						奖品数量之和除以（参与抽奖人数乘以每人能抽奖次 <br>
						数）如一等奖1名，二等奖2名，抽奖人数5人，每人<br>
						能抽2次，则中奖率为（1+2）/（5*2）= 30%。<br>
					</div>
					<i class=" g-relative icon iconfont icon-attention" style="color: #FFC000; vert"/>
				</i-poptip>
			</div>
		</i-form>
		<div class="_footer">
			<i-button 
				@click="$router.go(-1)">取消</i-button>
			<i-button 
				type="primary"
				style="margin: 0 350px 0 5px" 
				@click="handleSubmit">保存</i-button>
		</div>
	</div>
</template>

<script>
import { Form, FormItem, Select, Option, Input, InputNumber, Button, Poptip } from 'iview';
import { ImgsPicker } from "wya-vc";
import { PModalRetatedMatter } from '@components/hr/academy-train-detail/_common/popup/related-matter';
import API_ROOT from '@stores/apis/root';
import oaTitle from '@components/hr/academy-train-detail/_common/title';

const NAME = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
export default {
	name: 'oa-tpl',
	components: {
		'oa-title': oaTitle,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-input': Input,
		'i-select': Select,
		'i-option': Option,
		'i-button': Button,
		'vc-imgs-picker': ImgsPicker,
		'i-input-number': InputNumber,
		'i-poptip': Poptip,
	},
	data() {
		this.NAME = NAME;
		return {
			relation_label: '',
			canEdit: true,
			// 根据query是否有lottery_id判断是编辑页面还是新建页面
			formValidate: {
				project_id: '',
				lottery_topic: '',
				lottery_id: '',
				relation_type: '',
				relation_id: [],
				lottery_describe: '',
				lottery_num: '',
				lottery_reward: [],
				user_num: null,
				times_limit: null,
				winning_tips: '',
				out_tips: ''
			},
			ruleValidate: {
				lottery_topic: [{ required: true, message: "请输入抽奖名称", trigger: 'blur' }],
				lottery_num: [{ required: true, type: 'number', message: "请选择奖项数", trigger: 'change' }],
				reward_name: [{ required: true, message: "请输入奖项名称", trigger: 'blur' }],
				reward_num: [{ required: true, type: 'number', message: "请输入奖项数量", trigger: 'blur' }],
				user_num: [{ required: true, type: 'number', message: "请输入参与抽奖人数", trigger: 'blur' }],
				times_limit: [{ required: true, type: 'number', message: "请输入每人能抽奖的次数", trigger: 'blur' }]
			}
		};
	},
	computed: {
		lotteryProbability() {
			return this.hanldeLotteryProbability();
		}
	},
	created() {
		this.handleInitData();
	},
	methods: {
		handleSubmit() {
			if (!this.canEdit) {
				this.$Message.error('已经有人参与抽奖，无法进行编辑！');
				return;
			}
			this.$refs.formValidate.validateAndScroll((valid) => {
				if (valid) {
					const { query = {} } = this.$route;

					// 如果有则是编辑接口， 没有是新建页面
					const lottery_id = query.lottery_id; 
					const url = lottery_id 
						? '_HR_ACADEMY_TRAIN_DETAIL_ENROLL_0_DRAW_EDIT_POST'
						: '_HR_ACADEMY_TRAIN_DETAIL_ENROLL_0_DRAW_ADD_POST';

					this.handleFormatRewardImage("POST");
					this.$request({
						url: API_ROOT[url],
						param: {
							lottery_id,
							...this.formValidate,
						},
						type: 'POST',
						loding: false
					}).then(res => {
						this.$router.push({
							path: '/hr/academy/train/detail/draw/0/manage',
							query: {
								project_id: this.formValidate.project_id,
								lottery_id: lottery_id || res.data.lottery_id // 编辑或者新添保存后跳转页面
							}
						});
						this.$Message.success(res.msg);
					}).catch(error => {
						this.$Message.error(error.msg);
					});
				}
			});
		},
		hanldeLotteryReward() {
			const targetNum = this.formValidate.lottery_num || 0;
			const nowNum = this.formValidate.lottery_reward.length;
			if (targetNum > nowNum) {
				for (let i = 0; i < targetNum - nowNum; i++) {
					this.formValidate.lottery_reward.push({
						reward_name: '',
						reward_num: null,
						rewardImage: [] // 传给后端需要字符串
					});
				}
			} else if (targetNum < nowNum) {
				this.formValidate.lottery_reward.splice(targetNum);
			}
		},
		handleError(err) {
			this.$Message.error(err.msg);
		},
		hanldeLotteryProbability() {
			// 计算中奖概率

			// 奖品数量之和
			const rewardNum = this.formValidate.lottery_reward.length 
				? this.formValidate.lottery_reward.reduce((pre, cur) => {
					return pre + cur.reward_num || 0;
				}, 0)
				: 0;

			// 抽奖总次数 = 参与抽奖人数乘以每人能抽奖次数
			const drawNum = (this.formValidate.user_num || 0) * (this.formValidate.times_limit || 0);
			
			// 分子为0 则直接返回0  
			if (!drawNum) return 0;
			return (rewardNum / drawNum).toFixed(5) * 100 || 0;
		},
		
		// 格式化图片数据与后端统一格式  "POST": 传给后端的格式化数据  "GET"： 获取数据的格式化 
		handleFormatRewardImage(type) {
			this.formValidate.lottery_reward.forEach(reward => {
				if (type === "POST") {
					reward.reward_image = reward.rewardImage[0] || '';
				} else if (type === "GET") {
					reward.rewardImage = reward.reward_image ? [reward.reward_image] : [];
				}
			});
		},

		handleInitData() {
			const { query = {} } = this.$route;
			this.formValidate.project_id = query.project_id;

			// 如果有则是编辑接口， 没有是新建页面
			const lottery_id = query.lottery_id; 
			if (lottery_id) {
				// 编辑页面  从接口获取数据
				this.$request({
					url: API_ROOT._HR_ACADEMY_TRAIN_DETAIL_ENROLL_0_DRAW_DETAIL_GET,
					param: { lottery_id },
					type: "GET"
				}).then(res => {
					this.formValidate = {
						...res.data
					};
					this.canEdit = !Number(res.data.lottery_record_num);
					this.formValidate.lottery_num = this.formValidate.lottery_reward.length;
					if (res.data.relation_type == 2) {
						this.relation_label = res.data.relation_id.map(v => v.course_name).join('、');
					} else {
						this.relation_label = '整个项目';
					}
					this.handleFormatRewardImage("GET");
				});
			} else {
				// 从query获取数据
				this.formValidate.relation_type = +query.relation_type;
				this.relation_label = query.label;
				if (this.formValidate.relation_type == '2') {
					this.formValidate.relation_id = query.relation_id.split(',').map(Number);
				}
			}
		},
		hadleRelatedMaster() {
			PModalRetatedMatter.popup({ 
				datas: {
					relation_id: this.formValidate.relation_id,
					relation_type: this.formValidate.relation_type
				}
			 }).then(res => {
				this.formValidate.relation_id = res.relation_id;
				this.formValidate.relation_type = +res.relation_type;
				this.formValidate.relation_course = res.relation_course;
				this.relation_label = res.label;
			});
		}
	},
};
</script>

<style lang="scss">
.v-hr-train-draw-edit-add-draw {
    padding: 15px 0 80px 20px;

	.ivu-form-item-label {
		color: #4B4F57
	}
	.ivu-input-number-handler-wrap {
		display: none;
	}
	._alert {
		.icon {
		vertical-align: middle;
		padding: 0 10px;
		}
		margin-top: 5px;
		width:1510px;
		height:40px;
		line-height: 40px;
		background:rgba(231,72,84, 0.05);
	}
	.__star {
		.ivu-form-item-label:before  {
			content: '*';
			display: inline-block;
			margin-right: 4px;
			line-height: 1;
			font-family: SimSun;
			font-size: 12px;
			color: #ed4014;
		}
	}
	.__line {
		margin-top: -10px;
		border-bottom: 1px solid #DCDFE4;
		width:1494px;
	}
	.__lottery-item {
		width:499px;
		height:165px;
		background:rgba(255,255,255,1);
		border:1px solid rgba(217, 220, 224, 1);
		border-radius:4px;
		margin-top: 20px;
		.__content {
			.ivu-form-item-error-tip {
				left: 50px;
			}
			display: flex;
			height: 125px;
			padding-top: 18px;
			.__left {
				width: 115px;
				padding-left: 20px;
				margin-top: -5px;
			}
			.__right {
				flex: 1;
			}
		}
		.__title {
			width:497px;
			height:40px;
			line-height: 40px;
			padding-left: 20px;
			border-radius:4px 4px 0px 0px;
			background:rgba(35,151,249,0.05);
		}
		.__hide-require {
			.ivu-form-item-label::before {
				content: ''!important
			}
		}
	}
	.__tip,
	.__tip2 {
		top: 1px;
		right: 34px;
		width: 22px;
		height: 20px;
		background: #fff;
	}
	.__tip2 {
		top: 3px;
		left: 276px;
	}
	.__probabilit {
		margin: -5px 0 0 100px;
		.icon {
			vertical-align: middle;
			padding: 0 5px;
			cursor: pointer;
		}
	}
    ._footer {
		background-color: #fff;
		position: fixed;
		bottom: 0;
		height: 45px;
		line-height: 45px;
		text-align: center;
		margin-left: -20px;
		width: 100%;
		box-shadow:0px -2px 10px 0px rgba(0, 0, 0, 0.08);
	}
}
</style>
