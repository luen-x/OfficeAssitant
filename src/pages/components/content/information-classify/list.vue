<template>
	<vc-paging
		ref="tableTarget"
		:columns="columns"
		:data-source="listInfo.data" 
		:total="listInfo.total"
		:reset="listInfo.reset"
		:history="true"
		:load-data="loadData"
		:expand-opts="expand"
		mode="table"
		class="g-m-t-20 v-content-information-classify-list"
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
		'vc-paging': Paging
	},

	mixins: [item],

	data() {
		const { query } = this.$route;

		return {
			selection: [],
			expand: {
				all: true,
				keys: [1],
				key: 'category_id'
			}
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.contentInformationClassify.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'CONTENT_INFORMATION_CLASSIFY_LIST_GET',
				type: 'GET',
				param: {
					...query,
					page,
					pageSize,
					material_type: 2,
					is_control_role: 0
				},
			}).then((res) => {
			}).catch((error) => {
			});
		},
		handleChangePageSize() {
			this.$store.commit('CONTENT_INFORMATION_CLASSIFY_LIST_INIT');
		}
	}
};
</script>

<style lang="scss">
</style>