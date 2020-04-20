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
		class="g-m-t-20 v-statistic-business-customer-deal-discount-list"
		@page-size-change="handleChangePageSize"
	/>
</template>

<script>
import { Paging } from 'wya-vc';
import { getParseUrl, getHashUrl, getFormatNum } from '@utils/utils';
import { tableHeight } from '@extends/mixins/tableHeight';
import { getDealCustomerQuery } from '../_common/util';



// item
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
	},
	mixins: [item, tableHeight({ expand: false, nav2: false, extra: 20 })],
	data() {
		const { query } = this.$route;

		return {
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.statisticBusinessCustomerDealDiscount.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'STATISTIC_BUSINESS_CUSTOMER_DEAL_DISCOUNT_LIST_GET',
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
			this.$store.commit('STATISTIC_BUSINESS_CUSTOMER_DEAL_DISCOUNT_LIST_INIT');
		}
	}
};

</script>

<style lang="scss">

</style>
