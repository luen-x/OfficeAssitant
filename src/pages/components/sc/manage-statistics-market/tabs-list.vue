<template>
	<div class="v-sc-manage-statistic-market-list">
		<div class="g-bg-gray-mid g-m-t-20 g-m-b-20 g-flex g-jc-sb g-pd-t-20 g-pd-b-20 _top">
			<div
				v-for="(item,index) in serviceScore"
				:key="index"
				:style="index === serviceScore.length - 1 ? {borderRight: 0} : ''"
				class="__average"
			>
				<div class="g-tc g-pd-t-10 g-fs-12" style="color: #818794;">{{ item.name }}</div>
				<div class="g-tc g-m-t-5 g-c-black2 g-fs-24">{{ item.point }}</div>
			</div>
		</div>
		<i-tabs 
			:value="type" 
			:animated="false"
			type="card" 
			style="margin-top: 20px"
			@on-click="handleChange"
		>
			<i-tab-pane
				v-for="(item,index) in tabs"
				:key="item.value"
				:label="`${item.label} ${listInfo.count[index]}`" 
				:name="item.value"
			>
				<vc-paging
					:columns="getColumns"
					:show="item.value == type" 
					:type="item.value"
					:data-source="listInfo[item.value].data"
					:total="listInfo[item.value].total"
					:reset="listInfo[item.value].reset"
					:current.sync="current[item.value]"
					:history="true"
					:load-data="loadData"
					:table-opts="{height: tableHeight}"
					class="v-sc-service-manage-statistics-market-list"
					mode="table"
					@page-size-change="handleChangePageSize"
				/>
			</i-tab-pane>
		</i-tabs>
	</div>
</template>

<script>
import { Tabs, TabPane } from 'iview';
import { Paging } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { tableHeight } from "@extends/mixins/table";
import { autoFix } from '@extends/mixins/auto-fix';
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane
	},
	mixins: [
		item,
		tableHeight({
			filter: true,
			tabs: true,
			footer: true
		}),
		autoFix()
	],
	data() {
		const { query } = this.$route;

		return {
			type: String(query.type || "1"), // 同tabs下的value
			customer_type: String(query.customer_type || "3"),
			placeOrderTime: [query.place_order_start_time, query.place_order_end_time],
			service_person_depart_id: query.service_person_depart_id 
				? query.service_person_depart_id.split(',').map((element) => Number(element)) : [], // 部门
			current: {},
			tabs: [
				{ label: '战区统计', value: '1' }, 
				{ label: '部门统计', value: '2' }, 
				{ label: '员工统计', value: '3' }
			],
			serviceScore: []
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.scManageStatisticsMarket.listInfo;
		}
	},
	watch: {
		 $route: {
			handler(val, oldVal) {
				if ((val.query.customer_type != oldVal.query.customer_type) 
				|| (val.query.place_order_start_time != oldVal.query.place_order_start_time)
				|| (val.query.place_order_end_time != oldVal.query.place_order_end_time)
				|| (val.query.service_person_depart_id != oldVal.query.service_person_depart_id)) {
					this.loadServiceData();
				}
			},
			// 深度观察监听
			deep: true
		}
	},
	mounted() {
		this.loadServiceData();
	},
	methods: {
		loadServiceData() {
			let { query = {} } = getParseUrl();
			let service_person_depart_id = query.service_person_depart_id 
				? (query.service_person_depart_id + '').split(",")[(query.service_person_depart_id + '').split(",").length - 1] : null;

			this.$request({
				url: "_SC_MANAGE_STATISTICS_SERVICE_SCORE",
				type: "GET",
				param: {
					...query,
					service_person_depart_id,
					customer_type: String(query.customer_type || "3")
				}
			}).then(res => {
				this.serviceScore = [
					{
						name: "客户小于6分率",
						point: res.data.service_score_step_rate_static.score_step_one_rate + "%"
					},
					{
						name: "客户8分率",
						point: res.data.service_score_step_rate_static.score_step_two_rate + "%"
					},
					{
						name: "客户9分率",
						point: res.data.service_score_step_rate_static.score_step_three_rate + "%"
					},
					{
						name: "客户10分率",
						point: res.data.service_score_step_rate_static.score_step_four_rate + "%"
					}
				];
			});
		},
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			let service_person_depart_id = query.service_person_depart_id 
				? (query.service_person_depart_id + '').split(",")[(query.service_person_depart_id + '').split(",").length - 1] : null;

			return this.request({
				url: 'SC_MANAGE_STATISTICS_MARKET_LIST_GET',
				type: 'GET',
				param: {
					...query,
					type: this.type,
					page,
					pageSize,
					customer_type: query.customer_type || "3",
					service_person_depart_id
				},
			}).then((res) => {
				this.resetType('1', this.listInfo.count, '/sc/manage/statistics/market');
			}).catch((error) => {
			});
		},
		handleChange(type) {
			this.type = type;

			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			query = {
				...query,
				type,
				page: this.current[type],
				fixPosition: false
			};
			this.$router.replace(getHashUrl('/sc/manage/statistics/market', { ...query }));
		},
		handleChangePageSize() {
			this.$store.commit('SC_MANAGE_STATISTICS_MARKET_LIST_INIT');
		}
	}
};
</script>

<style lang="scss">
.v-sc-manage-statistic-market-list{
	._top{
		height: 114px;

		.__average{
			width: 25%;
			height: 74px;
			border-right: 1px solid #D4D7DB;
		}
	}
}
</style>