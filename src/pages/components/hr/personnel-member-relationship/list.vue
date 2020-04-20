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
		class="g-m-t-20 v-hr-personnel-member-relationship"
		@page-size-change="handleChangePageSize"
	/>
</template>

<script>
import moment from 'moment';
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
		tableHeight({ filter: true, footer: true, tabs: true, })
	],
	data() {
		const { query } = this.$route;
		return {
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.hrPersonnelMemberRelationship.listInfo;
		},
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'HR_PERSONNEL_MEMBER_RELATIONSHIP_LIST_GET',
				type: 'GET',
				param: {
					...query,
					page,
					pageSize,
				},
				loading: false
			}).then((res) => {
			}).catch((error) => {
			});
		},
		handleChangePageSize() {
			this.$store.commit('HR_PERSONNEL_MEMBER_RELATIONSHIP_LIST_INIT');
		}
	}
};

</script>

<style lang="scss">

</style>
