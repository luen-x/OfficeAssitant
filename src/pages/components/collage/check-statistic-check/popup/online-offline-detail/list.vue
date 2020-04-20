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
		:table-opts="{ highlightRow: true }"
		mode="table"
		class="g-m-t-20 g-pd-b-20 v-collage-check-statistic-check-detail-list"
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
		staff_id: Number,
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
			return this.$store.state.collageCheckStatisticCheck.listInfoDetail;
		},
		tableHeight() {
			let len = 0;
			let listInfoData = this.$store.state.collageCheckStatisticCheck.listInfoDetail.data[this.curPage];

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
	watch: {
		staff_id(v) {
			this.$store.commit('COLLAGE_STATICSTIC_CHECK_QUALITY_LIST_INIT');
		}
	},
	mounted() {
		this.$store.commit('COLLAGE_STATICSTIC_CHECK_QUALITY_LIST_INIT');
		
		setTimeout(() => {
			this.showList = true;
		}, 100); 
	},
	methods: {
		loadData(page, pageSize) {
			const query = { ...this.query };
			this.inLoading = true;
			
			return this.request({
				url: 'COLLAGE_CHECK_STATISTIC_QUALITY_LIST_GET',
				type: 'GET',
				param: {
					...query,
					page: this.curPage ? page : 1,
					pageSize,
					staff_id: this.staff_id
				},
			}).then((res) => {
			}).catch((error) => {
				this.$Message.error(error.msg);
			}).finally(() => {
				this.inLoading = false;
			});
		},
		handleChangePageSize() {
			this.$store.commit('COLLAGE_STATICSTIC_CHECK_QUALITY_LIST_INIT');
		},
		handlePageChanges(page) {
			this.curPage = page;
		}
	}
};
</script>

<style lang="scss">
.v-collage-check-statistic-check-detail-list{
  .__footer{
		width: 940px !important;
	}

	.ivu-table-wrapper {
        border: none;
    }

    .ivu-table {
        th,td {
            border: none;
        }
    }

    .ivu-table:after {
        width: 0;
    }

    .ivu-table:before {
        height: 0;
    }

	.ivu-icon-ios-arrow-forward::before {
		content: '\F341';
		font-size: 20px;
		pointer-events: none;
	}

	.ivu-icon-ios-arrow-forward {
		margin-top: -4px;
	}

	td.ivu-table-expanded-cell{
		padding: 0px;
	}
}
</style>