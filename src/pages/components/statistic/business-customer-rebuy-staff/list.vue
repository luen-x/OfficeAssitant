<template>
	<vc-paging
		ref="tableTarget"
		:columns="columns"
		:data-source="listInfo.data" 
		:total="listInfo.total"
		:reset="listInfo.reset"
		:history="true"
		:load-data="loadData"
		mode="table"
		class="g-m-t-20 v-statistic-business-customer-rebuy-staff-list"
		@page-size-change="handleChangePageSize"
		@sort-change="handleSortChange"

	/>
</template>

<script>
import { Paging } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
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
			return this.$store.state.statisticBusinessCustomerRebuyStaff.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'STATISTIC_BUSINESS_CUSTOMER_REBUY_STAFF_LIST_GET',
				type: 'GET',
				param: {
					...query,
					page,
					pageSize
				},
			}).then((res) => {
				
			}).catch((error) => {
				console.error(error);
			});
		},
		handleChangePageSize() {
			this.$store.commit('STATISTIC_BUSINESS_CUSTOMER_REBUY_STAFF_LIST_INIT');
		},
		handleSortChange({ key, order }) {

			if (key == 'repeat_amount_total') {
				this.$router.replace({
					path: '/statistic/business/customer/rebuy/staff',
					query: {
						...this.$route.query,
						repeat_amount_total: order == 'normal' ? '' : order
					}
				});
				this.$store.commit('STATISTIC_BUSINESS_CUSTOMER_REBUY_STAFF_LIST_INIT');
			}
			
		}
	}
};

</script>

<style lang="scss">

</style>
