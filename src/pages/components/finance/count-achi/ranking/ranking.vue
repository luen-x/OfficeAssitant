<template>
	<div class="v-finance-count-achi-ranking">
		<i-collapse v-model="value" >
			<i-panel name="1">营销中心业绩排名
				<div slot="content" class="g-flex g-m-b-25 _paging">
					<div class="_item">
						<h3 class="g-m-l-10 g-m-b-10">{{ listInfo[1].data.sort_name }}</h3>
						<vc-paging
							:columns="columnsOne"
							:show="true"
							:type="1"
							:data-source="listInfo[1].data"
							:total="listInfo[1].total"
							:reset="listInfo[1].reset"
							:history="true"
							:load-data="loadDataOne"
							:page-opts="{showElevator:false,showSizer:false,size: 'small'}"
							mode="table"
							@page-size-change="handleChangePageSize"
						/>
					</div>
					<div class="_item">
						<h3 class="g-m-l-10 g-m-b-10">{{ listInfo[3].data.sort_name }}</h3>
						<vc-paging
							:columns="columnsTwo"
							:show="true"
							:type="1"
							:data-source="listInfo[3].data"
							:total="listInfo[3].total"
							:reset="listInfo[3].reset"
							:history="true"
							:load-data="loadDataTwo"
							:page-opts="{showElevator:false,showSizer:false,size: 'small'}"
							mode="table"
							@page-size-change="handleChangePageSize"
						/>
					</div>
					<div class="_item">
						<h3 class="g-m-l-10 g-m-b-10">{{ listInfo[5].data.sort_name }}</h3>
						<vc-paging
							:columns="columnsThree"
							:show="true"
							:type="1"
							:data-source="listInfo[5].data"
							:total="listInfo[5].total"
							:reset="listInfo[5].reset"
							:history="true"
							:load-data="loadDataThree"
							:page-opts="{showElevator:false,showSizer:false,size: 'small'}"
							mode="table"
							@page-size-change="handleChangePageSize"
						/>
					</div>
				</div>
			</i-panel>
		</i-collapse>
	</div>
</template>

<script>
import { Row, Col, Collapse, Panel } from "iview";
import API_ROOT from "@stores/apis/root";
import { Paging } from "wya-vc";
import { getParseUrl, getHashUrl } from "@utils/utils";

import item from "./item";

export default {
	name: "v-finance-count-achi-ranking",
	components: {
		"i-row": Row,
		"i-col": Col,
		"vc-paging": Paging,
		"i-collapse": Collapse,
		"i-panel": Panel
	},
	mixins: [item],
	props: {
		month: String
	},
	data() {
		return { value: "1" };
	},
	computed: {
		listInfo() {
			return this.$store.state.financeCountAchi.listInfo;
		}
	},
	watch: {
		month(curVal, oldVal) {
			if (curVal !== oldVal) {
				// this.loadDataOne();
				this.$store.commit(
					"FINANCE_COUNT_STAFF_DETAIL_SORT_SUPER_LIST_INIT"
				);
				this.$store.commit(
					"FINANCE_COUNT_STAFF_DETAIL_SORT_DEPART_LIST_INIT"
				);
				this.$store.commit(
					"FINANCE_COUNT_STAFF_DETAIL_SORT_STAFF_LIST_INIT"
				);
			}
		}
	},
	created() {
		const { query = {} } = this.$route;
		this.$router.replace(
			getHashUrl("/finance/count/achi", {
				...query,
				page: 1,
				pageSize: 10,
			})
		);
	},
	mounted() {},

	methods: {
		loadDataOne(page, pageSize) {
			// 业绩统计-(第一个表)
			let { query = {} } = getParseUrl();
			return this.request({
				url: "FINANCE_COUNT_STAFF_DETAIL_SORT_SUPER_LIST_GET",
				type: "GET",
				param: {
					...query,
					page,
					month: this.month,
					pageSize
				}
			}).then(res => {
			}).catch(error => {
			});
		},
		handleChangePageSize() {
			// this.$store.commit('FINANCE_COUNT_STAFF_LIST_INIT');
		},
		loadDataTwo(page, pageSize) {
			// 业绩统计-(第二个表)
			let { query = {} } = getParseUrl();
			return this.request({
				url: "FINANCE_COUNT_STAFF_DETAIL_SORT_DEPART_LIST_GET",
				type: "GET",
				param: {
					...query,
					page,
					pageSize,
					month: this.month
				}
			}).then(res => {}).catch(error => {});
		},
		loadDataThree(page, pageSize) {
			// 业绩统计-(第三个表)
			let { query = {} } = getParseUrl();
			return this.request({
				url: "FINANCE_COUNT_STAFF_DETAIL_SORT_STAFF_LIST_GET",
				type: "GET",
				param: {
					...query,
					page,
					month: this.month,
					pageSize
				}
			}).then(res => {}).catch(error => {});
		}
	}
};
</script>

<style lang="scss" >
.v-finance-count-achi-ranking {
    ._paging {
        display: flex;
		justify-content: space-around;
		//  flex-direction:  column;
		._item{
			width: 30%;
			.vc-paging {
				margin-bottom: 40px;
				width: 100%;
				height:500px;
				position: relative !important;
			.ivu-table td, .ivu-table th {
				border-bottom:0 none;
			}
				.ivu-table-header {
					overflow: hidden;
					border: 1px solid #d4d7db;
					border-radius: 20px;
					th{
						background: #fff !important;
					}
				}
				.ivu-table-wrapper {
					border: 0;
				}
				.ivu-table:before,
				.ivu-table:after {
					border: 0;
					width: 0px;
				}
			.__footer {
				position: absolute !important;
				width: 100% !important;
				height: 60px;
				background: #fff;
				box-shadow: none !important;
				display: flex;
				justify-content:center;
				}
			}
		}

    }
}
</style>
