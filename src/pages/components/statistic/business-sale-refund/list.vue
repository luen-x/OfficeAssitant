<template>
	<vc-paging
		ref="tableTarget"
		:columns="columns"
		:data-source="listInfo.data" 
		:total="listInfo.total"
		:reset="listInfo.reset"
		:history="true"
		:load-data="loadData"
		:table-opts="{height: tableHeight}"
		mode="table"
		class="g-m-t-20 v-statistic-business-sale-refund-list"
		@page-size-change="handleChangePageSize"
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
		'vc-paging': Paging,
	},
	mixins: [
		item,
		tableHeight({ expand: false, nav2: false, tab: false, extra: 44 })
	],
	data() {
		const { query } = this.$route;

		return {
			formatConfig: [
				{ key: 'refund_amount', precision: 2, prefix: "", suffix: '' }
			]
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.statisticBusinessSaleRefund.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'STATISTIC_BUSINESS_SALE_REFUND_LIST_GET',
				type: 'GET',
				param: {
					...query,
					page,
					pageSize,
					type: query.current_tab,
					current_tab: '',
					year: +query.current_tab === 2 ? query.year : '',
					season: +query.currentTab === 3 ? query.season[1] : '',
					month: +query.current_tab === 4 ? query.month : ''
				},
				initList: (list) => {
					return formatNumBatch(list, this.formatConfig);
				}
			}).then((res) => {
			}).catch((error) => {
			});
		},
		handleChangePageSize() {
			this.$store.commit('STATISTIC_BUSINESS_SALE_REFUND_LIST_INIT');
		}
	}
};
</script>

<style lang="scss">
</style>