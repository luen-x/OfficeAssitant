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
		class="g-m-t-20 v-hr-salary-subsidy-traffic-list"
		@page-size-change="handleChangePageSize"
	/>
</template>

<script>
import moment from 'moment';
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
	mixins: [
		item, 
		tableHeight({ nav1: true, nav2: true, tab: true, extra: 36 })
	],
	data() {
		const { query } = this.$route;

		return {
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.hrSalarySubsidyTraffic.listInfo;
		},
		month() {
			return this.$store.state.hrSalarySubsidyTraffic.month;
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'HR_SALARY_SUBSIDY_TRAFFIC_LIST_GET',
				type: 'GET',
				param: {
					...query,
					page,
					pageSize,
					month: query.month ? query.month : this.month
				},
				loading: false
			}).then((res) => {
			}).catch((error) => {
			});
		},
		handleChangePageSize() {
			this.$store.commit('HR_SALARY_SUBSIDY_TRAFFIC_LIST_INIT');
		}
	}
};

</script>

<style lang="scss">

</style>
