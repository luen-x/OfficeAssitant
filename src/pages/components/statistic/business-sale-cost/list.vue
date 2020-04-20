<template>
	<vc-paging
		ref="tableTarget"
		:columns="columns"
		:data-source="listInfo.data" 
		:total="listInfo.total"
		:reset="listInfo.reset"
		:history="true"
		:table-opts="{height: tableHeight}"
		:load-data="loadData"
		mode="table"
		class="g-m-t-20 v-statistic-business-sale-cost-list"
		@page-size-change="handleChangePageSize"
		@sort-change="handleSortChange"
	/>
</template>

<script>
import { Paging } from 'wya-vc';
import { getParseUrl, getHashUrl, formatNumBatch } from '@utils/utils';
import { tableHeight } from '@extends/mixins/tableHeight';
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging
	},
	mixins: [
		item,
		tableHeight({ expand: false, nav2: false, tab: false, extra: 44, extraClass: ['v-statistic-business-sale-cost-content'] })
	],
	data() {
		const { query } = this.$route;

		return {
			formatConfig: [ 
				{ key: 'customer_count', precision: 0, prefix: '', suffix: '' },
				{ key: 'product_count', precision: 0, prefix: '', suffix: '' },
				{ key: 'total_amount', precision: 2, prefix: '', suffix: '' },
				{ key: 'cost_amount_ratio', precision: 2, prefix: "", suffix: '%' }
			],
			sort: {}
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.statisticBusinessSaleCost.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();

			return this.request({
				url: 'STATISTIC_BUSINESS_SALE_COST_LIST_GET',
				type: 'GET',
				param: {
					...query,
					type: query.currentTab,
					currentTab: '',
					year: +query.currentTab === 2 ? query.year : '',
					season: +query.currentTab === 3 ? query.season : '',
					month: +query.currentTab === 4 ? query.month : '',
					depart_id: query.depart_id,
					page,
					pageSize,
					...this.sort
				},
				initList: (list) => {
					return formatNumBatch(list, this.formatConfig);
				}
			}).then((res) => {
			}).catch((error) => {
				this.$Message.error(error.msg);
			});
		},
		handleChangePageSize() {
			this.$store.commit('STATISTIC_BUSINESS_SALE_COST_LIST_INIT');
		},
		handleSortChange({ key, order }) {
			this.sort = {
				sort_field: key,
				sort_order: order
			};

			this.$store.commit('STATISTIC_BUSINESS_SALE_COST_LIST_INIT');
		}
	}
};
</script>

<style lang="scss">
</style>