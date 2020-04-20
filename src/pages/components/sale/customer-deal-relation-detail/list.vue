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
		class="g-m-t-20 v-sale-relation-detail-list"
		@row-click="handleOpenDrawer"
		@page-size-change="handleChangePageSize"
	/>
</template>

<script>
import { Paging } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
// item
import item from './item';

export default {
	name: 'oa-relation-detail-list',
	components: {
		'vc-paging': Paging,
	},
	mixins: [item],
	data() {
		const { query } = this.$route;

		return {
			
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.saleCustomerDealRelationDetail.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			
			return this.request({
				url: 'SALE_CUSTOMER_DEAL_RELATION_DETAIL_LIST_GET',
				type: 'GET',
				param: {
					...query,
					page,
					pageSize
				},
			}).then((res) => {
			}).catch((error) => {
				error && console.error(error);
			});
		},
		handleChangePageSize() {
			this.$store.commit('SALE_CUSTOMER_DEAL_RELATION_DETAIL_LIST_INIT');
		}
	}
};

</script>

<style lang="scss">

</style>
