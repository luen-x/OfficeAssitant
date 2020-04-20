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
		class="g-m-t-20 v-sale-property-coin-list"
		@page-size-change="handleChangePageSize"
		@sort-change="handleSortChange"
	/>
</template>

<script>
import { Paging } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { tableHeight } from '@extends/mixins/tableHeight';
// item
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
	},
	mixins: [item, tableHeight({
		nav2: false,
		tab: false,
		extra: 20
	})],
	data() {
		const { query } = this.$route;

		return {
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.salePropertyCoin.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'SALE_PROPERTY_COIN_LIST_GET',
				type: 'GET',
				param: {
					...query,
					page,
					pageSize
				},
			}).then((res) => {
				
			}).catch(console.error);
		},
		handleChangePageSize() {
			this.$store.commit('SALE_PROPERTY_COIN_LIST_INIT');
		},
		// 排序方式变化
		handleSortChange(sort) {
			const map = { asc: 1, desc: 2 };
			const query = {};
			if (sort.order !== 'normal') {
				query[`sort_field`] = sort.key;
				query[`sort_type`] = map[sort.order];
			}
			this.$vc.emit("SALE_PROPERTY_COIN_SORT_CHANGE", query);
		},
	}
};

</script>

<style lang="scss">

</style>
