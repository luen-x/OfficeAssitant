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
		class="g-m-t-20 v-hr-recruit-school-summary-elists-list"
		@page-size-change="handleChangePageSize"
	/>
</template>

<script>
import { Paging } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
// item
import item from './item';

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
			return this.$store.state.hrRecruitSchoolSummaryElists.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'HR_RECRUIT_SCHOOL_SUMMARY_ELISTS_LIST_GET',
				type: 'GET',
				param: {
					...query,
					type: query.recruitType === 'school' ? 2 : 3,
					page,
					pageSize
				},
			}).then((res) => {
			}).catch((error) => {
			});
		},
		handleChangePageSize() {
			this.$store.commit('HR_RECRUIT_SCHOOL_SUMMARY_ELISTS_LIST_INIT');
		}
	}
};

</script>

<style lang="scss">

</style>
