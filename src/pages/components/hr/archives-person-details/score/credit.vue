<template>
	<div class="v-hr-archives-score-table">
		<i-tabs 
			:value="scoreType" 
			:animated="false" 
			style="margin-top: 20px" 
			name="tabscore"
			@on-click="handleChange"
		>
			<i-tab-pane 
				v-for="(item) in tabs" 
				:key="item.value" 
				:label="item.label" 
				:name="item.value"
				tab="tabscore"
			>
				<div v-if="scoreType==='1'" class="g-flex g-flex-sb" >
					<div 
						v-for="(item,index) in propsObj.month.detail"
						:key="index"
						class="g-flex  g-flex-ac" 
					>
						<div >
							<div class="__title">{{ item.type_name }}</div>
							<div class="__count">{{ item.point }}</div>
						</div>
					</div>
					<div class="g-flex  g-flex-ac" >
						<div class="__title">合计{{ name }}</div>
						<div class="__count">{{ propsObj.month.sum }}</div>
					</div>
				</div>
				<div v-if="scoreType==='2'" class="g-flex g-flex-sb _year" >
					<template 
						v-for="(item,index) in propsObj.year.detail"
						class="g-flex"
					>
						<div :key="index" class="g-flex g-flex-ac g-flex-cc _content">
							<div class="__title">{{ item.month }}</div>
							<div class="__count">{{ item.point }}</div>
						</div>
					</template>
					<div class="g-flex g-flex-ac g-flex-cc _content" >
						<div class="__title">合计{{ name }}</div>
						<div class="__count">{{ propsObj.year.sum }}</div>
					</div>
					<div class="g-flex g-flex-ac g-flex-cc _content" >
						<div class="__title">晋级{{ name }}</div>
						<div class="__count">{{ propsObj.year.usable_sum }}</div>
					</div>
				</div>
			</i-tab-pane>
		</i-tabs>
	</div>
</template>

<script>
import { Tabs, TabPane } from 'iview';
import { Paging } from 'wya-vc';
import API_ROOT from "@stores/apis/root";
import { getParseUrl, getHashUrl } from '@utils/utils';

export default {
	name: 'v-hr-archives-score-table',
	components: {
		'vc-paging': Paging,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
	},
	props: {
		propsObj: Object,
		name: String
	},
	data() {
		const { query } = this.$route;
		return {
			data: {},
			scoreType: String(query.scoreType || "1"), // 同tabs下的value
			current: {},
			
			tabs: [{
				label: "每月学分",
				value: "1"
			},
			{
				label: "年度学分",
				value: "2"
			}
			],
		};
	},
	methods: {
		handleChange(scoreType) {
			this.scoreType = scoreType;
			// let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			// query = {
			// 	...query,
			// 	scoreType,
			// };
			// this.$router.replace(
			// 	getHashUrl("/hr/archives/person/details", { ...query })
			// );
		},
		
	}
};
</script>

<style lang="scss">
.v-hr-archives-score-table {

	._year{
		border:1px solid red;
		background-color: #F5F5F6;
		width: 100%;
		height:60px;
		 justify-content: space-between;
		._content{
			width: calc(100% / 14);
			display:flex;
			justify-content: center;
			flex-direction: column;
		}
		._content + ._content {
			border-left: 1px solid #d4d7db;
		}
	}
	.ivu-tabs-ink-bar {
		z-index:15 !important;
		margin-left: 15px !important;
		margin-right: 15px !important;
		width: 58px !important;
		border-bottom: 3px solid #e84c57 !important;
	}
}
</style>
