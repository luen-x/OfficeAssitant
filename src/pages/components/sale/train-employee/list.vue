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
		class="g-m-t-20 v-sale-train-employee-list"
		@page-size-change="handleChangePageSize"
		@row-click="handleOpenDrawer"
	/>
</template>

<script>
import { Paging } from 'wya-vc';
import { tableHeight } from '@extends/mixins/tableHeight';
import { getParseUrl, getHashUrl } from '@utils/utils';
// item
import item from './item';

export default {
	name: 'oa-train-employee-list',
	components: {
		'vc-paging': Paging,
	},
	mixins: [
		item,
		tableHeight({
			nav1: true,
			nav2: false,
			tab: false,
			extra: 30
		})
	],
	data() {
		const { query } = this.$route;

		return {

		};
	},
	computed: {
		listInfo() {
			return this.$store.state.saleTrainEmployee.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'SALE_TRAIN_EMPLOYEE_LIST_GET',
				type: 'GET',
				param: {
					...query,
					page,
					pageSize,
					type: 1
				},
			}).then((res) => {

			}).catch((error) => {
				console.error(error);
			});
		},
		handleChangePageSize() {
			this.$store.commit('SALE_TRAIN_EMPLOYEE_LIST_INIT');
		}
	}
};

</script>

<style lang="scss">
.v-sale-train-employee-list {
	.ivu-table-cell {
		white-space: nowrap;
	}
}
</style>
