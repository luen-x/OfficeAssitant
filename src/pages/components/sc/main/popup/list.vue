<template>
	<vc-paging
		ref="list"
		:show="showList"
		:columns="columns"
		:data-source="listInfo.data" 
		:total="listInfo.total"
		:reset="listInfo.reset"
		:history="false"
		:load-data="loadData"
		:footer="!inLoading"
		:table-opts="{height: tableHeight, highlightRow: true}"
		mode="table"
		class="g-m-t-20 v-sc-main-right-side-list"
		@page-change="handlePageChanges"
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
	props: {
		query: {
			type: Object,
			default: () => ({})
		}
	},
	data() {
		const { query } = this.$route;

		return {
			showList: false,
			inLoading: false,
			curPage: 0
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.scMain.listInfo;
		},
		tableHeight() {
			let len = 0;
			let listInfoData = this.$store.state.scMain.listInfo.data[this.curPage];

			for (let i in listInfoData) {
				listInfoData[i] && len++;
			}

			let winHeight;

			if (len > 15) {
				// 获取窗口高度
				if (window.innerHeight) {
					winHeight = window.innerHeight - 250;
				} else if (document.body && document.body.clientHeight) {
					winHeight = document.body.clientHeight - 250;
				}

				return winHeight;
			}
		}
	},
	mounted() {
		setTimeout(() => {
			this.showList = true;
		}, 100); 

		this.$store.state.scMain.listInfo.data[1] && this.$store.commit('SC_MAIN_SUPPLIST_LIST_INIT');
	},
	methods: {
		loadData(page, pageSize) {
			const query = { ...this.query };
			this.inLoading = true;
			
			return this.request({
				url: 'SC_MAIN_SUPPLIST_LIST_GET',
				type: 'GET',
				param: {
					...query,
					page: this.curPage ? page : 1,
					pageSize
				},
			}).then((res) => {
			}).catch((error) => {
				this.$Message.error(error.msg);
			}).finally(() => {
				this.inLoading = false;
			});
		},
		handleChangePageSize() {
			this.$store.commit('SC_MAIN_SUPPLIST_LIST_INIT');
		},
		handlePageChanges(page) {
			this.curPage = page;
		}
	}
};
</script>

<style lang="scss">
.v-sc-main-right-side-list{
    .__footer{
		width: 940px !important;
	}
}
</style>