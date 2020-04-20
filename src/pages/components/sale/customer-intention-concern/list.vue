<template>
	<vc-paging
		ref="tableTarget"
		:columns="columns"
		:data-source="listInfo.data" 
		:total="listInfo.total"
		:reset="listInfo.reset"
		:history="true"
		:load-data="loadData"
		:table-opts="{height: tableHeight, highlightRow: true }"
		mode="table"
		class="g-m-t-20 v-sale-customer-intention-concern-list"
		@page-size-change="handleChangePageSize"
		@row-click="handleRowClick"
	/>
</template>

<script>
import { Paging } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import checkAll from '@extends/mixins/checkAll';
import { tableHeight } from '@extends/mixins/tableHeight';
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
	},
	mixins: [item, tableHeight({
		nav2: false,
		tab: false,
		extra: 65,
	})],
	data() {
		const { query } = this.$route;
		return {
			myProp: { remain_num: 0 }
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.saleCustomerIntentionConcern.listInfo;
		}
	},
	created() {
		this.loadProp();
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'SALE_CUSTOMER_INTENTION_CONCERN_LIST_GET',
				type: 'GET',
				param: {
					...query,
					page,
					pageSize
				},
			}).then((res) => {
			}).catch(console.error);
		},
		loadProp() {
			this.$request({
				url: "SALE_PROPERTY_MINE_LIST_GET",
				type: 'GET',
				param: {},
				loading: false
			}).then((res) => {
				this.myProp = res.data.list.find(it => it.type_id === 7) || { remain_num: 0 };
			});
		},
		handleChangePageSize() {
			this.$store.commit('SALE_CUSTOMER_INTENTION_CONCERN_LIST_INIT');
		}
	}
};
</script>

<style lang="scss">
.v-sale-customer-intention-concern-list {
	._tag {
		display: inline-block;
		height: 20px;
		width: 20px;
		border-radius: 12px;
		background: #e84854;
		text-align: center;
		color: white;
		padding-top: 1px;
	}
}
</style>
