<template>
	<vc-paging
		ref="tableTarget"
		:columns="columns"
		:data-source="listInfo.data" 
		:total="listInfo.total"
		:reset="listInfo.reset"
		:history="true"
		:load-data="loadData"
		:table-opts="{height: tableHeight, highlightRow: true}"

		mode="table"
		class="g-m-t-20 v-statistic-business-customer-deal-type-list"
		@page-size-change="handleChangePageSize"
		@sort-change="handleSortChange"

	/>
</template>

<script>
import { Paging } from 'wya-vc';
import { getParseUrl, getHashUrl, getFormatNum } from '@utils/utils';
import { tableSort } from '@extends/mixins/tableSort';
import { tableHeight } from '@extends/mixins/tableHeight';
import { getDealCustomerQuery } from '../_common/util';


// item
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
	},
	mixins: [item, tableSort(), tableHeight({ expand: false, nav2: false, extra: 20 })],
	data() {
		const { query } = this.$route;

		return {
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.statisticBusinessCustomerDealType.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'STATISTIC_BUSINESS_CUSTOMER_DEAL_TYPE_LIST_GET',
				type: 'GET',
				param: {
					...getDealCustomerQuery(query),
					page,
					pageSize
				},
				initList: list => {
					list.forEach(it => {
						it.amount = getFormatNum(it.amount);
					});
					return list;

				}
			}).then((res) => {
				
			}).catch((error) => {
				console.error(error);
			});
		},
		handleChangePageSize() {
			this.$store.commit('STATISTIC_BUSINESS_CUSTOMER_DEAL_TYPE_LIST_INIT');
		}
	}
};

</script>

<style lang="scss">

</style>
