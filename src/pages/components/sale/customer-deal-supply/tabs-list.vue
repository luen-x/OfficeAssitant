<template>
	<i-tabs
		:value="type"
		:animated="false"
		type="card"
		style="margin-top: 20px"
		@on-click="handleChange"
	>
		<i-tab-pane
			v-for="(item,index) in tabs"
			:key="item.value"
			:label="item.label+count[index]"
			:name="item.value"
		>
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
				:table-opts="{height: tableHeight,highlightRow: true}"
				class="v-sale-customer-deal-supply-list"
				mode="table"
				@row-click="handleOpenDrawer"
				@page-size-change="handleChangePageSize"
			/>
		</i-tab-pane>
	</i-tabs>
</template>

<script>
import { Tabs, TabPane } from 'iview';
import { Paging } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { tableHeight } from '@extends/mixins/tableHeight';
import { autoFix } from '@extends/mixins/auto-fix';
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
	},
	mixins: [
		item,
		tableHeight(),
		autoFix()
	],
	data() {
		const { query } = this.$route;
		return {
			type: String(query.type || "1"), // 同tabs下的value
			current: {},
			firstLoad: !query.type,
			count: [0, 0, 0, 0],
			tabs: [
				{ label: '待审核', value: '1' },
				{ label: '已通过', value: '2' },
				{ label: '未通过', value: '3' }
				// { label: '已取消', value: '4' }
			],
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.saleCustomerDealSupply.listInfo;
		},
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'SALE_CUSTOMER_DEAL_SUPPLY_LIST_GET',
				type: 'GET',
				param: {
					is_own: this.$auth[803] ? 2 : 1,
					...query,
					type: this.type,
					page,
					pageSize
				},
			}).then((res) => {
				this.count = [res.data.default_count, res.data.success_count, res.data.error_count];
				this.resetType('1', this.count, '/sale/customer/deal/supply');
			}).catch((error) => {
				console.error(error);
			});
		},
		handleChange(type) {
			this.type = type;
			this.firstLoad = false;
			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			query = {
				...query,
				fixPosition: false,
				type,
				page: this.current[type]
			};
			this.$router.replace(getHashUrl('/sale/customer/deal/supply', { ...query }));
			this.$nextTick(() => {
				this.$refs.tableTarget[+type - 1].$refs.tableTarget.handleResize();
			});
		},
		handleChangePageSize() {
			this.$store.commit('SALE_CUSTOMER_DEAL_SUPPLY_LIST_INIT');
		},
	}
};


</script>

<style lang="scss">
.v-sale-customer-deal-apply-list{
	.ivu-table-cell{
		white-space: nowrap;
	}
}
</style>
