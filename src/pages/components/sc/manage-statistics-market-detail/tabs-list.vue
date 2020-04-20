<template>
	<div class="v-sc-manage-statistics-market-detail-list">
		<div v-if="$auth[1667]" class="g-relative g-m-t-20" style="height: 32px">
			<div class="g-red-btn-line g-absolute" style="right: 0;" @click="handleExport">
				导出
			</div>
		</div>
		<i-tabs 
			:value="type" 
			:animated="false"
			type="card" 
			@on-click="handleChange"
		>
			<i-tab-pane 
				v-for="(item, index) in tabs"
				:key="item.value"
				:label="`${item.label} ${listInfo.count[index]}`"
				:name="item.value"
			>
				<vc-paging
					:ref="'table' + item.value"
					:columns="columns"
					:show="item.value == type" 
					:type="item.value"
					:data-source="listInfo[item.value].data"
					:table-opts="{height: tableHeight, highlightRow: true}"
					:total="listInfo[item.value].total"
					:reset="listInfo[item.value].reset"
					:current.sync="current[item.value]"
					:history="true"
					:load-data="loadData"
					class="v-sc-manage-statistics-market-detail-list"
					mode="table"
					@page-size-change="handleChangePageSize"
					@row-click="handleOpenDrawer"
				/>
			</i-tab-pane>
		</i-tabs>
	</div>
</template>

<script>
import { Tabs, TabPane } from 'iview';
import { Paging } from 'wya-vc';
import { tableHeight } from '@extends/mixins/table';
import { getParseUrl, getHashUrl } from '@utils/utils';
import API_ROOT from '@stores/apis/root';
// item
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
	},
	mixins: [item, tableHeight({
		tabs: true,
		footer: true
	}) 
	],
	data() {
		const { query } = this.$route;

		return {
			type: String(query.type || "1"), // 同tabs下的value
			current: {},
			tabs: [
				{ label: '所有客户', value: '1' }, 
				{ label: '总质检客户', value: '2' }, 
				{ label: '未质检客户', value: '3' }, 
				{ label: '非雷/未评客户', value: '4' }, 
				{ label: '<6分/雷区客户', value: '5' }, 
				{ label: '6≤X<8分客户', value: '6' }, 
				{ label: '8≤X≤10分客户', value: '7' }, 
				{ label: '10分客户', value: '8' }
			],
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.scManageStatisticsMarketDetail.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'SC_MANAGE_STATISTICS_MARKET_DETAIL_LIST_GET',
				type: 'GET',
				param: {
					...query,
					type: this.type,
					service_depart_id: query.service_depart_id || null,
					service_staff_id: query.service_staff_id || null,
					page,
					pageSize
				},
			}).then((res) => {
				
			}).catch(console.error);
		},
		handleChange(type) {
			this.type = type;

			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			query = {
				...query,
				type,
				page: this.current[type]
			};
			this.$router.replace(getHashUrl('/sc/manage/statistics/market/detail', { ...query }));
		},
		handleChangePageSize() {
			this.$store.commit('SC_MANAGE_STATISTICS_MARKET_DETAIL_LIST_INIT');
		},
		handleExport() {

			const url = getHashUrl(API_ROOT["_SC_MANAGE_STATISTICS_MARKET_DETAIL_LIST_EXPORT_GET"], {
				type: '1',
				...this.$route.query,
				"-token": this.$global.token
			});

			window.open(url);
		}
	}
};

</script>

<style lang="scss">
.v-sc-manage-statistics-market-detail-list {
}
</style>
