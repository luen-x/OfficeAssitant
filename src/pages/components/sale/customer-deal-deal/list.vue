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
		class="g-m-t-20 v-sale-customer-deal-deal-list g-m-b-30"
		style="margin-bottom:0px"
		@row-click="handleRowClick" 
		@page-size-change="handleChangePageSize"
	/>
</template>

<script>
import { Paging } from 'wya-vc';
import { Button, Checkbox, TabPane, Tabs } from 'iview';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { tableHeight } from '@extends/mixins/tableHeight';
import { Distribute } from '../_common/customer/distribute';
import { ChooseStaff } from '../_common/customer/choose-staff';


// item
import item from './item';
import { getAuth } from '../_common/util';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'i-button': Button,
		'i-checkbox': Checkbox,

	},
	mixins: [
		item,
		tableHeight({
			tab: false,
			extra: 30
		})
	],
	data() {
		const { query } = this.$route;
		return {
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.saleCustomerDealDeal.listInfo;
		},
	},
	beforeCreate() {
		this.getAuth = getAuth;
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: "SALE_CUSTOMER_DEAL_DEAL_LIST_GET",
				type: 'GET',
				param: {
					is_own: this.$auth[439] ? 2 : 1,
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
			this.$store.commit('SALE_CUSTOMER_DEAL_DEAL_LIST_INIT');
		},
		handleChoose() {
			if (this.selected.length == 0) {
				this.$Message.warning("请选择要指派的客户");
				return;
			}
			const customer_ids = this.selected.map(_item => {
				return _item.customer_id;
			});
			Distribute.popup({
				customerIds: customer_ids
				
			}).then(() => {
				// 进行指派
				this.handleResetCur();
				this.isAll = false;
			}).catch(() => {
			});
			// ChooseStaff.popup({
			// 	customer_ids,
			// 	type: 'distribute',
			// 	title: "选择指派人"
			// }).then(() => {
			// 	// 进行指派
			// 	this.handleResetCur();
			// 	this.isAll = false;
			// }).catch(() => {
			// });

		},
	}
};

</script>

<style lang="scss">
.v-sale-customer-deal-deal-list{
	.ivu-table-cell{
		white-space: nowrap;
	}

}
</style>
