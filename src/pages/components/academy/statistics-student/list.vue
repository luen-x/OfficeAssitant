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
		class="g-m-t-20 v-academy-statistics-student-list"
		@page-size-change="handleChangePageSize"
		@row-click="handleOpenDrawer"
	/>
</template>

<script>
import { Paging } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { tableHeight } from "@extends/mixins/tableHeight";
// item
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging
	},
	mixins: [
		item,
		tableHeight({
			nav2: false,
			extra: -50
		})
	],
	data() {
		const { query } = this.$route;

		return {
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.academyStatisticsStudent.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			let depart_id = query.depart_id 
				? (query.depart_id + '').split(",").pop() : null;

			return this.request({
				url: 'ACADEMY_STATISTICS_STUDENT_LIST_GET',
				type: 'GET',
				param: {
					...query,
					page,
					pageSize,
					depart_id
				},
			}).then((res) => {
			}).catch((error) => {
				this.$Message.error(error.msg);
			});
		},
		handleChangePageSize() {
			this.$store.commit('ACADEMY_STATISTICS_STUDENT_LIST_INIT');
		}
	}
};
</script>

<style lang="scss">
</style>