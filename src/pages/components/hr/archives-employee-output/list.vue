<template>
	<vc-paging
		ref="tableTarget"
		:columns="columns"
		:data-source="listInfo.data"
		:total="listInfo.total"
		:reset="listInfo.reset"
		:history="true"
		:load-data="loadData"
		:table-opts="{height: tableHeight, highlightRow: true }"
		mode="table"
		class="g-m-t-20 v-hr-archives-employee-output-list"
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
			nav2: false
		})
	],
	data() {
		const { query } = this.$route;

		return {
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.hrArchivesEmployeeOutput.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'HR_ARCHIVES_EMPLOYEE_OUTPUT_LIST_GET',
				type: 'GET',
				param: {
					...query,
					page,
					pageSize
				},
				initList: (list) => {
					return list.map(it => ({
						...it,
						progress: Math.floor(Math.random() * 100)
					}));
				}
			}).then((res) => {
			}).catch((error) => {
			});
		},
		handleChangePageSize() {
			this.$store.commit('HR_ARCHIVES_EMPLOYEE_OUTPUT_LIST_INIT');
		}
	}
};

</script>

<style lang="scss">

</style>
