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
		class="g-m-t-20 v-hr-employee-score-integration-audit-list"
		@page-size-change="handleChangePageSize"
		@sort-change="handleSortChange"
	/>
</template>

<script>
import { Paging } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { tableHeight } from '@extends/mixins/table';
// item
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
	},
	mixins: [
		item,
		tableHeight({
			filter: true,
			tabs: true,
			footer: true,
			extraHeight: 100
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
			return this.$store.state.hrEmployeeScoreIntegrationAudit.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'HR_EMPLOYEE_SCORE_INTEGRATION_AUDIT_LIST_GET',
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
			this.$store.commit('HR_EMPLOYEE_SCORE_INTEGRATION_AUDIT_LIST_INIT');
		},
		handleSortChange({ key, order }) {
			let { query = {} } = getParseUrl();
			delete query.sort;
			delete query.total_point_sort;
			const orderMap = {
				asc: 'SORT_ASC',
				desc: 'SORT_DESC',
				normal: undefined
			};
			const keyMap = {
				count: 'sort',
				total_point: 'total_point_sort'
			};
			let type = keyMap[key];
			query[type] = orderMap[order];

			this.$router.replace(
				getHashUrl("/hr/employee/score/integration/audit", { ...query })
			);
			this.$store.commit("HR_EMPLOYEE_SCORE_INTEGRATION_AUDIT_LIST_INIT");
		},
	}
};

</script>

<style lang="scss">

</style>
