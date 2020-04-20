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
		class="g-m-t-20 v-content-satoolkit-download-list"
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
		tableHeight({
			filter: true,
			footer: true,
		})
	],
	data() {
		const { query } = this.$route;

		return {
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.contentSatoolkitDownload.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'CONTENT_CONFIG_MATERIAL_DOWNLOAD_LIST_GET',
				redirect: 'CONTENT_SATOOLKIT_DOWNLOAD_LIST_GET_SUCCESS',
				type: 'GET',
				param: {
					...query,
					page,
					pageSize,
					kit_type: 2,
					type: 2
				},
			}).then((res) => {

			}).catch((error) => {
				console.error(error);
			});
		},
		handleChangePageSize() {
			this.$store.commit('CONTENT_SATOOLKIT_DOWNLOAD_LIST_INIT');
		}
	}
};

</script>

<style lang="scss">

</style>
