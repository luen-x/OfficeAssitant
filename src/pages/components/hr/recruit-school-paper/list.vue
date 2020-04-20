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
		class="g-m-t-20 v-hr-recruit-paper-list"
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
		tableHeight({ tab: false, extra: 26 })
	],
	data() {
		const { query } = this.$route;
		return {
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.hrRecruitSchoolPaper.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'HR_RECRUIT_SCHOOL_PAPER_LIST_GET',
				type: 'GET',
				param: {
					...query,
					page,
					pageSize
				},
			}).catch((error) => {
				this.$Message.error(error.msg);
			});
		},
		handleChangePageSize() {
			this.$store.commit('HR_RECRUIT_SCHOOL_PAPER_LIST_INIT');
		}
	}
};

</script>

<style lang="scss">
.v-hr-recruit-paper-list {
	.v-auto-tooltip {
		width: 78%;
	}
}
</style>
