<template>
	<div class="c-rolling-draw">
		<div class="_content g-clearfix" style="transform: scale(.9)">
			<div class="__left">
				<div class="__select">
					<i-select 
						v-model="nowRewardId" 
						size="large"
						class="__reward-select"
						style="width:300px"
						@on-change="handleRewardChange">
						<i-option 
							v-for="reword in drawData.lottery_reward"
							:key="reword.reward_id"
							:value="reword.reward_id"
						> 奖项{{ REWARD_SORT[reword.sort - 1] }}</i-option>
					</i-select>
				</div>
				<div class="__reward-info">
					<div class="__name">{{ nowRewardData.reward_name }}</div>
					<div class="__img">
						<img :src="nowRewardData.reward_image || OSS_LUCKDRAW_ICON08">
					</div>
					<div class="__reward-num">奖品共：{{ nowRewardData.reward_num }}个</div>
					<div class="__winner-num">已中奖：{{ nowRewardData.winning_num }}人</div>
					<div class="__reward-num g-m-t-15">
						<span>本轮抽取：</span>
						<i-select 
							v-model="drawNum" 
							size="large"
							clearable
							class="__draw-num"
							style="width: 320px; margin-left: -10px">
							<i-option :value="1">1人</i-option>
							<i-option :value="2">2人</i-option>
							<i-option :value="3">3人</i-option>
							<i-option :value="5">5人</i-option>
							<i-option :value="10">10人</i-option>
							<i-option 
								v-if="nowRewardData.reward_num - nowRewardData.winning_num" 
								:value="nowRewardData.reward_num - nowRewardData.winning_num">
								剩下的{{ nowRewardData.reward_num - nowRewardData.winning_num }}人
							</i-option>
						</i-select>
					</div>
				</div>
			</div>
			<div class="__right">
				<div class="__top-name">{{ nowRewardData.reward_name }}</div>
				<div class="__content">
					<img v-if="nowDrawStatus === '0'" :src="OSS_LUCKDRAW_BG06"> <!--未抽奖 -->
					<img v-if="nowDrawStatus !== '0'" :src="OSS_LUCKDRAW_BG05" class="__bg-img">
					<div v-if="nowDrawStatus" style="height: 100%">
						<oa-draw-animate v-if="isDrawing"/>
						<oa-winner-list 
							v-if="!isDrawing && nowDrawStatus !== '0'"
							ref="list"
							:can-edit="canEdit"
							:data="drawResult"
							@delete-record="handleDeleteRecord"/>
					</div> <!--抽奖中 -->
				</div>
			</div>
		</div>
		<div style="margin: -10px auto; text-align: center">

			<div 
				:style="{ marginTop: isFullScreen ? '-20px' : '10px'}"
				class="_btn"
				@click="handleOperate"
			>
				<span class="g-relative" style="z-index: 99; font-weight: bold;">{{ statusData[nowDrawStatus] }}</span>
				<img :src="OSS_LUCKDRAW_ICON01">
			</div>
		</div>
		
	</div>
</template>
<script>
import { Select, Option } from 'iview';
import { debounce } from 'lodash';
import { OSS_LUCKDRAW_BG06, OSS_LUCKDRAW_BG05, OSS_LUCKDRAW_ICON01,
	OSS_LUCKDRAW_ICON04, OSS_LUCKDRAW_ICON08
} from '@constants/constants';
import API_ROOT from '@stores/apis/root';
import { ModalTip } from '@components/hr/academy-train-detail/_common/popup/model-tips';
import DrawAnimate from './draw-animate';
import WinnerList from './show-winner-list';

const REWARD_SORT = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];

export default {
	components: {
		'i-select': Select,
		'i-option': Option,
		'oa-draw-animate': DrawAnimate,
		'oa-winner-list': WinnerList
	},
	props: {
		isFullScreen: Boolean
	},
	data() {
		return {
			drawData: { // 保存抽奖的信息
				lottery_reward: [],
			},
			firstIn: true,
			isDrawing: false, // 是否正在抽奖
			nowDrawStatus: '0',

			// 保存抽奖状态信息  
			// 0: 未进行 1：可以再次抽奖 2：抽奖中 3：奖品已经抽完
			statusData: ['开始抽', '继续抽', '停止', '查看中奖名单'],

			drawNum: 1, // 抽奖人数
			nowRewardId: '', // 当前奖项
			drawResult: [], // 抽奖结果
			canEdit: false, // 是否可以删除中将人员

			OSS_LUCKDRAW_BG06,
			OSS_LUCKDRAW_BG05,
			REWARD_SORT,
			OSS_LUCKDRAW_ICON01,
			OSS_LUCKDRAW_ICON04,
			OSS_LUCKDRAW_ICON08
		};
	},
	computed: {
		// 当前奖项数据
		nowRewardData() {
			return this.drawData.lottery_reward.filter(v => v.reward_id === this.nowRewardId)[0] || {};
		}
	},
	created() {
		this.loadData();
	},
	methods: {
		handleRewardChange(id) {
			this.loadData();
		},
		loadData() {
			return this.$request({
				url: API_ROOT._HR_ACADEMY_TRAIN_DRAW_INFO_GET,
				param: { lottery_id: this.$route.query.lottery_id },
				type: 'GET',
				loading: false
			}).then(({ data }) => {
				this.drawData = {
					...data
				};

				// 第一次进来赋值奖项一为默认值
				if (this.firstIn) {
					this.nowRewardId = data.lottery_reward[0].reward_id;
					this.nowDrawStatus = this.handleNowDrawStatus(this.drawData.lottery_reward.filter(v => v.reward_id === this.nowRewardId)[0]);
					this.firstIn = false;
					this.$emit('set-topic', data);
				} else {
					this.nowDrawStatus = this.handleNowDrawStatus(this.nowRewardData);
				}
				if (this.nowDrawStatus === '3' || this.nowDrawStatus === '1') {
					this.handleWinnerList();
					// this.$request({
					// 	url: API_ROOT._HR_ACADEMY_TRAIN_DRAW_RESULT_GET,
					// 	param: {
					// 		lottery_id: this.$route.query.lottery_id,
					// 		reward_id: this.nowRewardData.reward_id,
					// 	},
					// 	type: 'GET',
					// 	loading: false
					// }).then((res) => {
					// 	this.drawResult = res.data.list;
					// 	this.canEdit = true;
					// });
				}
			});
		},
		handleOperate: debounce(function () {
			this.drawResult = [];
			switch (this.nowDrawStatus) {
				case '0':
				case '1': 
					if (!this.drawNum) {
						this.$Message.error('请先选择本轮抽取人数');
						return;
					}
					this.handleDraw();
					break;
				case '2':
					this.handleStopDraw();
					break;
				case '3':
					this.handleWinnerList();
					break;
				default:
					throw Error('有错');
			}
		}, 200),
		handleDraw() {
			this.isDrawing = true;
			this.nowDrawStatus = '2';
		},
		handleNowDrawStatus(nowRewardData) {
			const { winning_num, reward_num } = nowRewardData;
			if (winning_num === reward_num && reward_num) {
				return '3';
			} else if (winning_num > 0 && winning_num < reward_num) {
				if (this.isDrawing) {
					return '2';
				} else {
					return '1';
				}
			} else if (winning_num === 0) {
				return '0';
			}
		},
		async handleStopDraw() {
			this.isDrawing = false;
			
			// 先更新数据 再更新状态 敲黑板！！！
			await this.handleNowDrawResult();
			this.nowDrawStatus = this.handleNowDrawStatus(this.nowRewardData);
		},
		async handleNowDrawResult() {
			// 获取本次抽奖结果
			this.canEdit = false;
			try {
				const { nowRewardData, drawNum } = this;
				const { data } = await this.$request({
					url: API_ROOT._HR_ACADEMY_TRAIN_DRAW_NOW_DRAW_GET,
					param: {
						lottery_id: this.$route.query.lottery_id,
						reward_id: nowRewardData.reward_id,
						lottery_num: drawNum
					},
					type: 'GET',
					loading: false
				});
				this.drawResult = data;
				this.nowRewardData.winning_num = this.nowRewardData.winning_num + this.drawResult.length;
				// 根据返回值的长度 而不是请求的长度更新已中奖人数 敲黑板！！！
			} catch (err) {
				this.$Message.error(err.msg);
			}
		},
		async handleWinnerList() {
			this.isDrawing = false;
			const res = await this.handleWinnerListItem();
			this.drawResult = res.data.list;
			const requestArr = [];
			if (res.data.totalPage > 1) {
				for (let i = 2; i <= res.data.totalPage; i++) {
					requestArr.push(this.handleWinnerListItem(i));
				}
			}
			const result = await Promise.all(requestArr);
			result.forEach(data => {
				this.drawResult.push(...data.data.list);
			});
			this.canEdit = true;
		},
		async handleWinnerListItem(page = 1, pageSize = 100) {
			const res = await this.$request({
				url: API_ROOT._HR_ACADEMY_TRAIN_DRAW_RESULT_GET,
				param: {
					lottery_id: this.$route.query.lottery_id,
					reward_id: this.nowRewardData.reward_id,
					page,
					pageSize
				},
				type: 'GET',
				loading: false
			});
			return res;
		},
		handleDeleteRecord(recordId, totalPage) {
			ModalTip.popup({
				content: "您确定要删除该中奖人吗？"
			}).then(() => {
				return this.$request({
					url: API_ROOT._HR_ACADEMY_TRAIN_DRAW_RESULT_DELETE_GET,
					param: { 
						reward_id: this.nowRewardData.reward_id,
						record_id: recordId
					},
					type: 'GET'
				});
			}).then(() => {
				this.drawResult = this.drawResult.filter(v => v.record_id !== recordId);
				this.nowRewardData.winning_num = this.drawResult.length;
				this.nowDrawStatus = this.handleNowDrawStatus(this.nowRewardData);
				if (this.drawResult.length && this.drawResult.length % 8 === 0
				&& this.$refs.list && totalPage === this.$refs.list.nowIndex + 1) {
					this.$refs.list.nowIndex = this.$refs.list.nowIndex - 1 >= 0 ? this.$refs.list.nowIndex - 1 : 0;
				}
			}).catch(err => {
				console.error(err);
				err.msg && this.$Message.error(err.msg);
			});
			
		},
	}
};
</script>

<style lang="scss">
.c-rolling-draw {
    width: 100%;
    height: 100%;
	// overflow: hidden;
    .__left {
        width: 530px;
        margin-right: 45px;
		float: left;
        .__select {
			width: 266px;
			margin-bottom: 20px;
			.ivu-select-selection {
				background: none;
				height: 50px;
				border:2px solid rgba(255,255,255,1);
				.ivu-select-placeholder, 
				.ivu-select-selected-value {
					line-height: 46px!important;
					height: 50px!important;
					font-size: 24px;
					color: #fff!important;
					padding-left: 16px!important;
				}
				.ivu-select-dropdown {
					background: none;
				}
				.ivu-select-arrow {
					color: #fff
				}
			}
		}
		.__reward-info {
			width: 530px;
			height: 580px;
			background:rgba(0, 0 ,0, 0.7);
			border-radius:8px;
			padding: 30px 0 0 20px;
			.__name {
				font-size: 30px;
				font-weight: 400;
				color: #fff;
				padding-bottom: 15px;
			}
			.__img {
				width: 260px;
				height: 260px;
				border-radius: 8px;
				// overflow: hidden;
				img {
					object-fit: cover;
					width: 100%;
					height: 100%;
				}
			}
			.__reward-num {
				font-size: 30px;
				padding-top: 15px;
				color: #fff!important;
				.ivu-select-selection {
				height: 50px;
				.ivu-select-placeholder, 
				.ivu-select-selected-value {
					color: #000;
					line-height: 46px!important;
					height: 50px!important;
					font-size: 24px;
					padding-left: 16px!important;
				}
				.ivu-select-dropdown {
					top: 370px;
					left: 170px;
				}
			}
			}
			.__winner-num {
				font-size: 30px;
				color: #FFF10A;
			}
		}
    }
	.__draw-num {
		.ivu-select-dropdown {
			top: 335px!important;
			left: 170px!important;
		}
	}
    .__right {
        height: 580px;
		width: 900px!important;
		float: left;
		background: rgba(0, 0, 0, .7);
		border-radius: 8px; 
		padding: 25px;
		margin-top: 70px;
		position: relative;
		z-index: 1;
		.__top-name {
			position: absolute;
			font-size: 40px;
			color: #fff;
			top: -70px;
		}
		.__content {
			height: 100%;
			width: 100%;
			// background: #F4ECDE;
			border-radius: 8px;
			overflow: hidden;
			position: relative;
			.__bg-img {
				position: absolute;
				z-index: 0;
			}
			img {
				height: 100%;
				width: 100%;
				object-fit: cover
			}
		}
    }
	._btn {
		width: 650px;
		height: 110px;
		text-align: center;
		line-height: 98px;
		color: rgba(242,33,33,1);
		font-size: 50px;
		font-weight: 600;
		cursor: pointer;
		transform: scale(.8);
		display: inline-block;
		border-radius: 50px;
		overflow: hidden;
		box-shadow: 0 0 70px  rgba(45, 5, 5, 0.8);
		img {
			position: absolute;
			left: 0
		}
	}
}
</style>
