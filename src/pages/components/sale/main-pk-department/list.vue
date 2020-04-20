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
		class="g-m-t-20 v-sale-main-pk-department-list"
		@page-size-change="handleChangePageSize"
	/>
</template>

<script>
import { Paging } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
// item
import item from './item';
import { getNowMonth } from './_common/common-filter';

export default {
	name: 'oa-table',
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
			return this.$store.state.saleMainPkDepartment.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'SALE_MAIN_PK_DEPARTMENT_LIST_GET',
				type: 'GET',
				param: {
					...query,
					page,
					staff_type: 1,
					pageSize,
					// month: getNowMonth()
				},
			}).then((res) => {

				// 判断是否有操作 栏
				if (this.columns.length > 10) {
					!res.data.del_btn && this.columns.pop();
				}
				if (this.columns.length > 10) {
					!this.$auth['370'] && this.columns.pop();
				}
				
				if (!res.data.total) return;
				this.$store.commit('SALE_MAIN_PK_SUMMARY_DATA', { pkSummary: res.data.total });
			}).catch((error) => {
				console.error(error);
			});
		},
		handleChangePageSize() {
			this.$store.commit('SALE_MAIN_PK_DEPARTMENT_LIST_INIT');
		}
	}
};

</script>

<style lang="scss">

</style>
