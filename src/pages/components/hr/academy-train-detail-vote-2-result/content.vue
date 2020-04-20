<template>
	<div class="v-hr-train-detail-vote-result">
		<div class="g-m-b-20 g-c-black2 g-fs-14">{{ voteData.vote_topic }}</div>
		<div class="g-flex _statistic">
			<div class="__left">
				<div class="__desc">参与人数</div>
				<div class="__num">{{ voteData.participator_count }}</div>
			</div>
			<div class="__line" />
			<div class="__right">
				<div class="__desc">投票数</div>
				<div class="__num">{{ voteData.vote_count }}</div>
			</div>
		</div>

		<div class="_title g-fs-14 g-c-black2">统计详情</div>
		<div v-for="(vote, i) in voteData.vote_items" :key="vote.item_id" class="__vote-item g-m-t-20">
			<div class="__title  g-fs-14 g-pd-l-20 g-m-b-10">
				<span class="g-c-blue-mid">投票{{ i + 1 }}：</span>
				<span class="g-c-black2">{{ vote.item_title }}（{{ +vote.is_multiple ? '多选' : '单选' }}）</span>
			</div>
			<div v-for="(item, j) in vote.item_option" :key="item.option_id" class="__progress g-m-b-15">
				<div class="__desc g-c-black2 g-fs-14">{{ item.option_name }}</div>
				<i-progress 
					:percent="+item.vote_percent" 
					:stroke-width="14"
					class="g-relative"
					style="width: 110%">
					<span class="g-fs-14 g-c-black2 g-pd-lr-5">{{ item.vote_count }}票（{{ item.vote_percent + '%' }}）</span>
					<span 
						v-if="voteData.vote_method == '2'" 
						class="g-c-blue-mid g-pointer g-absolute"
						style="right: 50px; top: 0" 
						@click="handleToggle(j, i, item.option_id, vote.item_id, item, voteData.vote_id)">
						<i
							:class="item.expand ? 'icon-triangle-up' : 'icon-triangle-down'" 
							class="iconfont g-fs-12"
							style="transform: scale(.8)"
						/>
						<span class=" g-fs-12 g-pd-l-5 g-pd-r-15 g-pointer">{{ item.expand ? '收起' : '展开' }}</span>
					</span>
				</i-progress>
				<vc-expand
					:ref="'expand' + item.option_id"
					v-model="item.expand"
					:id="'scroll' + item.option_id" 
				>
					<div 
						class="g-c-blue-mid"
					>
						<div 
							v-if="!((participatorData[item.option_id]|| {}).list || []).length" 
							style="line-height: 60px; text-align: center;">无数据</div>
						<span 
							v-for="name in (participatorData[item.option_id]|| {}).list" 
							:key="name.staff_id" 
							class="__item"> {{ name.staff_name }}</span>
					</div>
				</vc-expand>
				
			</div>
		</div>
</div></template>

<script>
import { Progress } from 'iview';
import { Expand } from 'wya-vc';
import API_ROOT from '@stores/apis/root';
import { debounce } from 'lodash';

export default {
	name: 'oa-tpl',
	components: {
		'i-progress': Progress,
		'vc-expand': Expand
	},
	data() {
		return {
			// 投票数据
			voteData: {
				vote_method: '',
				vote_topic: '',
				participator_count: '',
				vote_count: '',
				vote_items: []
			},
			// 所有投票参与人数据 （包括分页数据， 用于下拉加载）
			participatorData: {
				// 格式
				// option_id: {
				// 	page: 1,
				// 	list: [{...}...]
				// }
			 }
		};
	},
	created() {
		this.handleLoadData();
	},
	methods: {
		async handleToggle(voteIndex, optionIndex, option_id, item_id, option_item, vote_id) {
			if (option_item.expand) {
				this.$refs['expand' + option_id][0].toggle();
				return;
			}
			const page = (this.participatorData[option_id] || {}).page || 1;
			// 判断是否加载过
			const hasToggleSince = (this.participatorData[option_id] || {}).hasToggleSince;
			if (!hasToggleSince) {
				try {
					this.handleLoadParticipator({ item_id, option_id, vote_id, page });
				} catch (error) {
					console.error(error);
				}
			} else {
				this.$refs['expand' + option_id][0].toggle();
			}
		},
		handleLoadData() {
			this.$request({
				url: API_ROOT._HR_ACADEMY_TRAIN_DETAIL_VOTE_2_RESULT_GET,
				param: { vote_id: this.$route.query.vote_id },
				type: 'GET'
			}).then(res => {
				res.data.vote_items.forEach(vote => {
					vote.item_option.forEach(option => {
						option.expand = false;
					});
				});
				this.voteData = {
					...res.data,
				};
			}).catch(error => { this.$Message.error(error.msg); });
		},
		handleLoadParticipator({ vote_id, item_id, option_id, page }) {
			return this.$request({
				url: API_ROOT._HR_ACADEMY_TRAIN_DETAIL_VOTE_2_VOTE_PARTICIPATE_GET,
				param: { vote_id, option_id, item_id, page, pageSize: 30 },
				type: "GET"
			}).then(({ data }) => {
				const newList = ((this.participatorData[option_id] || {}).list || []).concat(data.list);
				this.$set(this.participatorData, option_id, {
					...data,
					hasToggleSince: true 
				});
				this.$set(this.participatorData[option_id], 'list', newList);
				this.$refs['expand' + option_id][0].toggle();
				return data;
			}).then(data => {
				const itemData = this.participatorData[option_id];
				const isEnd = itemData.list.length === data.totalCount;
				const dom = this.$refs['expand' + option_id][0].$el;
				if (isEnd) {
					dom.removeEventListener('scroll', itemData.scrollFun);
				} else {
					// 等待下拉加载
					if (!itemData.scrollFun) {
						const scrollFun = () => {
							const { scrollTop, offsetHeight, scrollHeight } = dom;
							if (scrollTop + offsetHeight == scrollHeight) {
								this.handleScrollData({ vote_id, option_id, item_id, page: page + 1 });
							}
						};
						itemData.scrollFun = debounce(scrollFun, 200);
					}
					dom.addEventListener('scroll', itemData.scrollFun);
				}
			}); 
		},
		handleScrollData({ vote_id, option_id, item_id, page }) {
			this.$request({
				url: API_ROOT._HR_ACADEMY_TRAIN_DETAIL_VOTE_2_VOTE_PARTICIPATE_GET,
				param: { vote_id, option_id, item_id, page, pageSize: 30 },
				type: "GET"
			}).then(({ data }) => {
				const itemData = this.participatorData[option_id];
				itemData.list.push(...(data.list || []));
				return data;
			}).then((data) => {
				const itemData = this.participatorData[option_id];
				const isEnd = itemData.list.length === data.totalCount;
				const dom = this.$refs['expand' + option_id][0].$el;
				if (isEnd) {
					dom.removeEventListener('scroll', itemData.scrollFun);
				} else {
					// 等待下拉加载
					if (!itemData.scrollFun) {
						const scrollFun = () => {
							const { scrollTop, offsetHeight, scrollHeight } = dom;
							if (scrollTop + offsetHeight == scrollHeight) {
								this.handleScrollData({ vote_id, option_id, page: page + 1 });
							}
						};
						itemData.scrollFun = debounce(scrollFun, 200);
					}
					dom.addEventListener('scroll', itemData.scrollFun);
				}
			}); 
		}
	},
};
</script>

<style lang="scss">
.v-hr-train-detail-vote-result {
	padding: 15px 0 20px 20px;
	._statistic {
		background:rgba(245,245,246,1);
		width: 98%;
		height: 130px;
		display: flex;
		.__left,
		.__right {
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: center;
			text-align: center;
		}
		.__desc {
			color: #818794;
			font-size: 14px
		}
		.__num {
			font-size: 24px;
			color: #333;
		}
	}
	.__line {
		width:1px;
		height:90px;
		margin-top: 20px;
		background-color: rgba(212,215,219, 0.5);
	}
	._title {
		position: relative;
		left: 10px;
		margin-top: 35px;
		&::before {
			content: '';
			top: 5px;
			left: -10px;
			position: absolute;
			width: 2px;
			height: 12px;
			background: rgba(231,72,84,1);
		}
	}
	.__vote-item {
		max-width: 1000px;
		width: 98%;
		min-width: 900px;
		padding-bottom: 30px;
		border:1px solid rgba(217, 220, 224, 1);
		border-radius:4px;
		.__title {
			height:40px;
			line-height: 40px;
			background:rgba(35,151,249, 0.05);
		}
	}
	.__progress {
		width: 820px;
		padding-left: 20px;
		.__desc {
			line-height: 30px;
			height: 30px;
		}
		.ivu-progress-outer {
			width: 720px;
		}
		.vc-expand {
			width: 102%;
			// height: 60px;
			max-height: 80px;
			overflow-y: auto;
			background: rgba(245,245,246,1);
			padding-bottom: 10px;
			margin: 10px 0;
			line-height: 26px;
			.__item {
				display: inline-block;
				min-width:60px;
				height:26px;
				line-height: 26px;
				margin: 10px 0 0px 10px;
				font-size: 12px;
				padding: 0 6px;
				text-align: center;
				background:rgba(255,255,255,1);
				border:1px solid rgba(35, 151, 249, 0.5);
				border-radius:4px;
			}
		}
	}
}
</style>
