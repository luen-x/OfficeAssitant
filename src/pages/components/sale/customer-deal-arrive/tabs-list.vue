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
			:label="item.label +count[index]"
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
				:page-opts="{showTotal: true,showSizer: true,showElevator: true,placement: 'top',pageSizeOpts: [10, 20, 30]}"
				class="v-sale-customer-deal-arrive-list"
				mode="table"
				@row-click="handleOpenDrawer"
				@page-size-change="handleChangePageSize"
			/>
		</i-tab-pane>
		<!-- <div slot="extra" style="margin-top: 7px;">
			<span class="g-c-black4">如何进行下单？</span>
			<span class="g-c-blue-mid g-pointer" @click="handleWatchVideo">视频教程</span>
		</div> -->
	</i-tabs>
</template>

<script>
import { Tabs, TabPane } from 'iview';
import { Paging } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { tableHeight } from '@extends/mixins/tableHeight';
import switchRow from '@extends/mixins/switchRow';
import { VideoModal } from '@components/_common/video-modal/video-modal';
import { autoFix } from '@extends/mixins/auto-fix';
import { saleDataStore } from '@components/sale/_common/util';

// item
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
		tableHeight({}),
		switchRow,
		autoFix()
	],
	data() {
		const { query } = this.$route;
		return {
			type: String(query.type || "1"),
			firstLoad: !query.type,
			

			current: {},
			tabs: [
				{ label: '待审核', value: '1', },
				{ label: '已通过', value: '2' },
				{ label: '未通过', value: '3', }
			],
			count: [0, 0, 0]
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.saleCustomerDealArrive.listInfo;
		},
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'SALE_CUSTOMER_DEAL_ARRIVE_LIST_GET',
				type: 'GET',
				param: {
					is_own: this.$auth[413] ? 2 : 1,
					...query,
					type: this.type,
					page,
					pageSize
				}
			}).then((res) => {
				this.openIndex = -1;
				this.count = [res.data.default_count, res.data.success_count, res.data.error_count];
				setTimeout(() => {
					if (saleDataStore.payment_id) {
						const id = saleDataStore.payment_id;
						delete saleDataStore.payment_id;
						const index = res.data.list.findIndex(item_ => {
							return item_.payment_id == id;
						});
						if (index > -1) {
							this.$refs.tableTarget[+this.type - 1].$refs.tableTarget.clickCurrentRow(index);
							this.openIndex = index;	
						}
						
					}
				}, 500);
				this.resetType('0', this.count, '/sale/customer/deal/arrive');
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
			this.$router.replace(getHashUrl('/sale/customer/deal/arrive', { ...query }));
		},
		handleChangePageSize() {
			this.$store.commit('SALE_CUSTOMER_DEAL_ARRIVE_LIST_INIT');
		},
		handleWatchVideo() {
			VideoModal.popup({
				title: '下单',
				urlType: 'SALE_ORDER'
			}).then((res) => {

			});
		},
	}
};
</script>

<style lang="scss">
.v-sale-customer-deal-arrive-list{
	.ivu-table-cell{
		white-space: nowrap;
	}
}
</style>
