<template>
	<div class="v-full-screen-draw g-clearfix">
		<div class="_topic">{{ drawData.lottery_topic }}</div>
		<img :src="OSS_WYA_LOGO" class="_logo">
		<oa-change-skin/>
		<oa-widget-item :full-screen="isFullScreen" @change-content="handleChangeContent"/>
		<div class="__main">
			<oa-rolling-draw
				v-show="!ishideDraw"
				:is-full-screen="isFullScreen"
				@set-topic="handleSetTopic"/>
		</div>
		<div 
			v-if="ishideDraw"
			class="__other">
			<div v-if="showResultOrInfo === 1" class="__introduce">
				<img :src="OSS_LUCKDRAW_BG05" >
				<span class="__text">{{ drawData.lottery_describe }}</span>
				<div class="__item">抽奖说明</div>
			</div>
			<div v-if="showResultOrInfo === 3">
				<div class="__top">
					<i-select 
						v-model="nowRewardId" 
						size="large"
						class="__reward-select"
						style="width: 266px"
						@on-change="handleWinnerList">
						<i-option 
							v-for="reword in drawData.lottery_reward"
							:key="reword.reward_id"
							:value="reword.reward_id"
						> 奖项{{ REWARD_SORT[reword.sort - 1] }}</i-option>
					</i-select>
					<span class="__text">获奖名单</span>
					<span class="__reward" style="color: #FFF">
						{{ nowRewardData.reward_name }}
						<span style="color: #FFF10A">共{{ nowRewardData.reward_num }}个</span>
					</span>
				</div>
				<div>
					<oa-winner-list ref="list" :data="drawResult" :page-size="12"/>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { OSS_WYA_LOGO, OSS_LUCKDRAW_BG05 } from '@constants/constants';
import { Select, Option } from 'iview';
import API_ROOT from '@stores/apis/root';
import ChangeSkin from './components/change-skin';
import RollingDraw from './components/rolling-draw';
import WidgetItem from './components/widget';
import WinnerList from './components/show-winner-list';

const REWARD_SORT = ['一', '二', '三', '四', '无', '六', '七', '八', '九', '十'];


export default {
	components: {
		'oa-change-skin': ChangeSkin,
		'oa-rolling-draw': RollingDraw,
		'oa-widget-item': WidgetItem,
		'oa-winner-list': WinnerList,
		'i-select': Select,
		'i-option': Option,
	},
	data() {
		return {
			OSS_WYA_LOGO,
			OSS_LUCKDRAW_BG05,
			showResultOrInfo: 0,
			drawData: {},
			drawResult: [],
			nowRewardId: '',
			isFullScreen: true,
			REWARD_SORT
		};
	},
	computed: {
		ishideDraw() {
			return this.showResultOrInfo === 1 || this.showResultOrInfo === 3;
		},

		// 当前奖项数据
		nowRewardData() {
			return this.drawData.lottery_reward.filter(v => v.reward_id === this.nowRewardId)[0] || {};
		}
	},
	watch: {
		showResultOrInfo(newVal) {
			if (newVal === 3) {
				this.handleWinnerList();
			}
		}
	},
	created() {
	},
	methods: {
		handleSetTopic(data) {
			this.drawData = {
				...data
			};
			this.nowRewardId = data.lottery_reward[0].reward_id;
			this.handleWinnerList();
		},
		handleChangeContent(val) {
			if (val !== 4) {
				this.showResultOrInfo = val;
			} else {
				// 全屏;
				this.handleFullScreen();
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
		// handleWinnerList() {
		// 	this.$request({
		// 		url: API_ROOT._HR_ACADEMY_TRAIN_DRAW_RESULT_GET,
		// 		param: {
		// 			lottery_id: this.$route.query.lottery_id,
		// 			reward_id: this.nowRewardId,
		// 		},
		// 		type: 'GET',
		// 		loading: false
		// 	}).then(({ data }) => {
		// 		this.drawResult = data.list;
		// 		if (this.$refs.list) {
		// 			this.$refs.list.nowIndex = 0;
		// 		}
		// 	});
		// },
		handleFullScreen() {
			const isFullscreen = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
			this.isFullScreen = isFullscreen;
			if (!isFullscreen) {
				(document.body.requestFullscreen && document.body.requestFullscreen())
					|| (document.body.mozRequestFullScreen && document.body.mozRequestFullScreen())
					|| (document.body.webkitRequestFullscreen && document.body.webkitRequestFullscreen()) 
					|| (document.body.msRequestFullscreen && document.body.msRequestFullscreen());
			} else {
				document.exitFullscreen 
					? document.exitFullscreen()
					: document.mozCancelFullScreen
						? document.mozCancelFullScreen()
						: document.webkitExitFullscreen 
							? document.webkitExitFullscreen()
							: '';
			}
		}
	}
};
</script>

<style lang="scss">
.v-full-screen-draw {
	.ivu-select-selection {
		background: none;
		height: 50px!important;
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
	._logo {
		width: 250px;
		top: 15px;
		left: 35px;
		position: absolute;
	}
	.__main {
		margin: 160px auto -10px;
		width: 1550px;
		min-width: 1550px;
		border-radius: 8px;
	}
	.__other {
		margin: 0 auto;
		margin-top: 300px;
		height: 600px;
		width: 1528px;
		background-color: rgba(0, 0, 0, 0.7);
		border-radius: 8px;
		padding: 35px 30px;
		position: relative;
		.__carousel-item {
			.__person {
				width: 310px!important;
				margin-left: 100px!important;
			}
		}
		.__top {
			position: absolute;
			display: flex;
			justify-content: flex-end;
			top: -70px;
			left: 0px;
			font-size: 40px;
			width: 100%;
			.__text {
				flex: 1;
				color: #fff;
				text-align: right;
			}
			.__reward {
				flex: 1;
				text-align: right;
				margin-left: 150px;
			}
		}
	}
	.__introduce {
		background: rgba(253,247,238,1);
		border-radius: 8px;
		height: 100%;
		width: 100%;
		padding: 50px 100px;
		font-size: 30px;
		color: #333;
		line-height: 60px;
		position: relative;
		.__item { 
			position: absolute;
			color: #fff;
			font-size: 40px;
			top: -110px;
			right: -30px;
		}
		.__text {
			position: relative;
			z-index: 9;
		}
		img {
			position: absolute;
			top: 0;
			left: 0;
			height: 100%;
			width: 100%;
			object-fit: cover;
			border-radius: 8px;
			z-index: 1;
		}
	}
	._topic {
		position: absolute;
		height: 78px;
		font-size: 80px;
		font-weight: bold;
		color: rgba(255,241,10,1);
		top: 40px;
		margin-left: 50%;
		transform: translateX(-50%);
	}

}

</style>


