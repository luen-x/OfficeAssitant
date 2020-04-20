<template>
	<vc-paging
		ref="tableTarget"
		:columns="columns"
		:data-source="listInfo.data" 
		:total="listInfo.total"
		:reset="listInfo.reset"
		:history="true"
		:load-data="loadData"
		:table-opts="{height: tableHeight,highlightRow: true}"
		mode="table"
		class="g-m-t-20 v-statistic-business-customer-renew-depart-list"
		@page-size-change="handleChangePageSize"
		@sort-change="handleSortChange"

	/>
</template>

<script>
import { Paging } from 'wya-vc';
import { getParseUrl, getHashUrl, getFormatNum } from '@utils/utils';
import { tableSort } from '@extends/mixins/tableSort';
import { tableHeight } from '@extends/mixins/tableHeight';

// item
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
	},
	mixins: [item, tableSort(), tableHeight({ expand: false, nav2: false, extra: 30 })],
	data() {
		const { query } = this.$route;

		return {
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.statisticBusinessCustomerRenewDepart.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: "STATISTIC_BUSINESS_CUSTOMER_RENEW_LIST3_GET",
				redirect: 'STATISTIC_BUSINESS_CUSTOMER_RENEW_DEPART_LIST_GET_SUCCESS',
				type: 'GET',
				param: {
					...query,
					page,
					pageSize
				},
				initList: (list) => {
					list.forEach(it => {
						it.renew_amount_total = getFormatNum(it.renew_amount_total);
					});
					// list = [...list, ...list];
					// list = [...list, ...list];
					// list = [...list, ...list];
					// list = [...list, ...list];
					return list;

				}
			}).then((res) => {
				console.log(res, 'res');
			}).catch((error) => {
				console.log(error, 'error');
			});
		},
		handleChangePageSize() {
			this.$store.commit('STATISTIC_BUSINESS_CUSTOMER_RENEW_DEPART_LIST_INIT');
		}
	}
};

</script>

<style lang="scss">

</style>
