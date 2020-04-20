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
		class="g-m-t-20 v-academy-support-study-download-list"
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
	mixins: [item,
		tableHeight({
			tab: false,
			extra: 40
		})
	],
	data() {
		const { query } = this.$route;

		return {
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.academySupportStudyDownload.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'CONTENT_CONFIG_MATERIAL_DOWNLOAD_LIST_GET',
				redirect: 'ACADEMY_SUPPORT_STUDY_DOWNLOAD_LIST_GET_SUCCESS',
				type: 'GET',
				param: {
					...query,
					type: 3,
					page,
					pageSize
				},
			}).then((res) => {
				
			}).catch(console.error);
		},
		handleChangePageSize() {
			this.$store.commit('ACADEMY_SUPPORT_STUDY_DOWNLOAD_LIST_INIT');
		}
	}
};

</script>

<style lang="scss">

</style>
