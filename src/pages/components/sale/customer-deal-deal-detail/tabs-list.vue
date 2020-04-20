<template>
	<i-tabs
		:value="type"
		:animated="false"
		type="card"
		style="margin-top: 20px"
		@on-click="handleChange"
	>
		<i-tab-pane v-for="(item) in tabs" :key="item.value" :label="item.label" :name="item.value">
			<vc-paging
				ref="tableTarget"
				:columns="getColumns(item.value)"
				:show="item.value == type"
				:type="item.value"
				:data-source="listInfo[item.value].data"
				:total="listInfo[item.value].total"
				:reset="listInfo[item.value].reset"
				:current.sync="current[item.value]"
				:history="true"
				:load-data="loadData"
				:table-opts="{highlightRow: true}"
				class="v-sale-customer-deal-deal-detail-list"
				mode="table"
				@row-click="(row)=>handleOpenDrawer(row,item.value)"
				@page-size-change="handleChangePageSize"
			/>
		</i-tab-pane>
	</i-tabs>
</template>

<script>
import { Tabs, TabPane } from 'iview';
import { Paging } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
	},
	mixins: [item],
	data() {
		const { query } = this.$route;

		return {
			type: String(query.type || "1"), // 同tabs下的value
			current: {},
			tabs: [
				{ label: '到账记录', value: '1' },
				{ label: '客户合同', value: '2' },
				{ label: '退款记录', value: '3' },
				{ label: '客户公司', value: '4' }
			],
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.saleCustomerDealDealDetail.listInfo;
		},
		isOwn() {
			// 成交客户下的列表数据都当做自己的客户处理
			return true;
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'SALE_CUSTOMER_DEAL_DEAL_DETAIL_LIST' + this.type + '_GET',
				type: 'GET',
				param: {
					...query,
					type: this.type,
					page,
					pageSize
				},
			}).then((res) => {
			}).catch((error) => {
				console.error(error);
			});
		},
		handleChange(type) {
			this.type = type;
			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			query = {
				...query,
				type,
				page: this.current[type]
			};
			this.$router.replace(getHashUrl('/sale/customer/deal/deal/detail', { ...query }));
			this.$nextTick(() => {
				this.$refs.tableTarget[+type - 1].$refs.tableTarget.handleResize();
			});
		},
		handleChangePageSize() {
			this.$store.commit('SALE_CUSTOMER_DEAL_DEAL_DETAIL_LIST' + this.type + '_INIT');
		}
	}
};
</script>

<style lang="scss">
.v-sale-customer-deal-deal-detail-list{
	.ivu-table-cell{
		white-space: nowrap;
	}
}
</style>
