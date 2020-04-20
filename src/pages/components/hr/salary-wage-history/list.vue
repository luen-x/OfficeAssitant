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
		class="g-m-t-20 v-hr-salary-wage-history-list"
		@page-size-change="handleChangePageSize"
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
		tableHeight({ filter: true, footer: true })
	],
	data() {
		const { query } = this.$route;

		return {
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.hrSalaryWageHistory.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'HR_SALARY_WAGE_HISTORY_LIST_GET',
				type: 'GET',
				param: {
					...query,
					page,
					pageSize
				},
				loading: false
			}).then((res) => {
			}).catch((error) => {
			});
		},
		handleChangePageSize() {
			this.$store.commit('HR_SALARY_WAGE_HISTORY_LIST_INIT');
		},
		loadTableTitle(type) {
			const { query } = this.$route;
			return this.$request({
				url: "_HR_RECRUIT_CONFIG_GET",
				type: "GET",
				param: {
					type: '2',
					scenario: 8
				},
				loading: false,
			}).then(res => {
				this.$store.commit('HR_SALARY_WAGE_HISTORY_TITLE_CHANGE', { ...res.data });
				return res;
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		}
	}
};

</script>

<style lang="scss">

</style>
