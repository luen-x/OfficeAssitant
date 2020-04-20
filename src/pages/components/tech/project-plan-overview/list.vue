<template>
	<vc-paging
		ref="tableTarget"
		:columns="columns"
		:data-source="listInfo.data" 
		:total="listInfo.total"
		:reset="listInfo.reset"
		:history="true"
		:load-data="loadData"
		:table-opts="{height: tableHeight, highlightRow: false}"
		mode="table"
		class="g-m-t-20 v-tech-project-plan-overview-list"
		@page-size-change="handleChangePageSize"
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
	mixins: [
		item,
		tableHeight({
			nav1: true,
			nav2: false,
		})
	],
	data() {
		const { query } = this.$route;

		return {};
	},
	computed: {
		listInfo() {
			return this.$store.state.techProjectPlanOverview.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'TECH_PROJECT_PLAN_OVERVIEW_LIST_GET',
				type: 'GET',
				param: {
					...query,
					is_page: 1,
					page,
					pageSize
				},
			}).catch((error) => {
				this.$Message.error(error.msg);
			});
		},
		handleChangePageSize() {
			this.$store.commit('TECH_PROJECT_PLAN_OVERVIEW_LIST_INIT');
		}
	}
};

</script>

<style lang="scss">
.v-tech-project-plan-overview-list {
	.ivu-table-cell {
		white-space: nowrap;
	}
}
</style>
