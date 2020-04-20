<template>
	<div>
		<div class="g-m-t-20" style="height: 36px;">
			<div 
				v-if="$auth[1546]"
				class="g-red-btn-line g-fr" 
				@click="() => handleCategory(rootObj, false)">添加类目</div>
		</div>
		<vc-paging
			ref="tableTarget"
			:columns="columns"
			:data-source="listInfo.data" 
			:total="listInfo.total"
			:reset="listInfo.reset"
			:history="true"
			:load-data="loadData"
			:load-expand-data="loadExpandData"
			:expand-opts="expand"
			mode="table"
			class="g-m-t-20 v-content-information-publish-manage-list"
			@page-size-change="handleChangePageSize"
		/>
	</div>
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
			loading: null,
			expand: {
				all: false,
				key: "id",
				keys: [],
			},
			rootObj: {
				category_name: '根目录',
				category_id: 0
			}
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.contentInformationPublishManage.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'CONTENT_INFORMATION_PUBLISH_MANAGE_LIST_GET',
				type: 'GET',
				param: {
					...query,
					page,
					pageSize
				},
			}).then((res) => {
				
			}).catch(console.error);
		},
		loadExpandData(opts) {
			const { index, row } = opts;
			this.loading = index;
			return this.$request({
				url: 'CONTENT_INFORMATION_PUBLISH_MANAGE_LIST_GET',
				type: 'GET',
				loading: false,
				param: {
					// kit_type: 2,
					pid: opts.row.category_id,
					// is_control_role: 0
				}
			}).then((res) => {
				this.loading = null;
				return res.data.list;
			}).catch((error) => {
				console.error(error);
			});
		},
		handleChangePageSize() {
			this.$store.commit('CONTENT_INFORMATION_PUBLISH_MANAGE_LIST_INIT');
		}
	}
};

</script>

<style lang="scss">

</style>
