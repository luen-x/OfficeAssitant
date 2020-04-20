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
		class="g-m-t-20"
		@page-size-change="handleChangePageSize"
		@page-change="handlePageChange"
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
			curPage: 1
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.scServiceInspectionRecord.listInfo;
		},

		tableHeight() {
			let len = 0;
			let listInfoData = this.$store.state.scServiceInspectionRecord.listInfo.data[this.curPage];

			for (let i in listInfoData) {
				listInfoData[i] && len++;
			}

			let winHeight;

			if (len > 15) {
				// 获取窗口高度
				if (window.innerHeight) {
					winHeight = window.innerHeight - 300;
				} else if (document.body && document.body.clientHeight) {
					winHeight = document.body.clientHeight - 300;
				}

				return winHeight;
			}
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'SC_SERVICE_INSPECTION_RECORD_LIST_GET',
				type: 'GET',
				param: {
					...query,
					page,
					pageSize
				},
			}).then((res) => {
			}).catch((error) => {
				this.$Message.error(error.msg);
			});
		},
		handleChangePageSize() {
			this.$store.commit('SC_SERVICE_INSPECTION_RECORD_LIST_INIT');
		},
		handlePageChange(page) {
			this.curPage = page;
		}
	}
};
</script>

<style lang="scss">
</style>