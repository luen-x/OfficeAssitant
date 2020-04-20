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
		class="g-m-t-20 v-sale-material-upload-my-list"
		@page-size-change="handleChangePageSize"
		@row-click="handleOpenDrawer"
	/>
</template>

<script>
import { Paging } from 'wya-vc';
import { tableHeight } from '@extends/mixins/tableHeight';
import { getParseUrl, getHashUrl } from '@utils/utils';
// item
import item from './item';

export default {
	name: 'oa-material-upload-my-list',
	components: {
		'vc-paging': Paging,
	},
	mixins: [
		item,
		tableHeight({
			nav1: true,
			nav2: false,
			tab: false,
			expand: false,
			extra: 105
		})
	],
	data() {
		const { query } = this.$route;

		return {};
	},
	computed: {
		listInfo() {
			return this.$store.state.saleFractionMaterialUploadMy.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'SALE_FRACTION_MATERIAL_UPLOAD_MY_LIST_GET',
				type: 'GET',
				param: {
					...query,
					page,
					pageSize
				},
			}).then((res) => {
				
			}).catch((error) => {
				console.error(error);
			});
		},
		handleChangePageSize() {
			this.$store.commit('SALE_FRACTION_MATERIAL_UPLOAD_MY_LIST_INIT');
		}
	}
};

</script>

<style lang="scss">
.v-sale-material-upload-my-list {
	.ivu-table-cell {
		white-space: nowrap;
	}
}
</style>
