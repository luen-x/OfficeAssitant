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
		class="g-m-t-20 v-finance-customer-nego-list"
		@row-click="handleOpenDrawer"
		@page-size-change="handleChangePageSize"
	/>
</template>

<script>
import { Paging } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { tableHeight } from '@extends/mixins/table';
// item
import item from './item';

const tagList = [
	{ key: 'discount', label: '打折' },
	{ key: 'renew', label: '续费' },
	{ key: 'repeat', label: '复购' }
];
export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
	},
	mixins: [
		item,
		tableHeight({
			filter: true,
			footer: true,
		})
	],
	data() {
		const { query } = this.$route;

		return {
			data: { 1: [{}] }
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.financeCustomerNego.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			let depart_id = (query.depart_id && typeof query.depart_id === 'string') ? query.depart_id.split(',').reverse()[0] : query.depart_id;

			return this.request({
				url: 'FINANCE_CUSTOMER_NEGO_LIST_GET',
				type: 'GET',
				param: {
					...query,
					page,
					depart_id,
					pageSize
				},
				initList: list => {
					list.forEach(it => {
						it.tagList = tagList.filter(i => it.tags[i.key]);
					});
					return list;
				}
			}).then((res) => {
			}).catch((error) => {
			});
		},
		handleChangePageSize() {
			this.$store.commit('FINANCE_CUSTOMER_NEGO_LIST_INIT');
		}
	}
};

</script>

<style lang="scss">

</style>
