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
				class="v-sale-customer-deal-contract-list"
				mode="table"
				@row-click="handleOpenDrawer"
				@page-size-change="handleChangePageSize"
			/>
		</i-tab-pane>
		<!-- <div slot="extra" style="margin-top: 7px;">
			<span class="g-c-black4">如何补交尾款？</span>
			<span class="g-operation" @click="handleWatchVideo('补交尾款','SALE_PAY_LEFT')">视频教程</span>
			&nbsp;&nbsp;|&nbsp;&nbsp;
			<span class="g-c-black4">如何申请退款？</span>
			<span class="g-operation" @click="handleWatchVideo('申请退款','SALE_REFUND')">视频教程</span>
		</div> -->
	</i-tabs>
</template>

<script>
import { Tabs, TabPane } from 'iview';
import { Paging, Expand } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { tableHeight } from '@extends/mixins/tableHeight';
import { VideoModal } from '@components/_common/video-modal/video-modal';
import { autoFix } from '@extends/mixins/auto-fix';
import { saleDataStore } from '../_common/util';

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
		autoFix()
	],
	data() {
		const { query } = this.$route;
		return {
			type: String(query.type || "1"), // 同tabs下的value
			firstLoad: !query.type,
			current: {},
			tabs: [
				{ label: '待审核', value: '1' },
				{ label: '已通过', value: '2' },
				{ label: '未通过', value: '3' },
				{ label: '已失效', value: '4' }
			],
			count: [0, 0, 0, 0]
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.saleCustomerDealContract.listInfo;
		},
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'SALE_CUSTOMER_DEAL_CONTRACT_LIST_GET',
				type: 'GET',
				param: {
					is_own: this.$auth[423] ? 2 : 1,
					...query,
					type: this.type,
					page,
					pageSize
				},
			}).then((res) => {
				this.count = [res.data.default_count, res.data.success_count, res.data.error_count, res.data.invalid_count];
				this.resetType('1', this.count, '/sale/customer/deal/contract');
				if (saleDataStore.contract_id) {
					setTimeout(() => {
						const id = saleDataStore.contract_id;
						delete saleDataStore.contract_id;
						
						const index = res.data.list.findIndex(item_ => {
							return item_.contract_id == id;
						});
						if (index > -1) {
							this.$refs.tableTarget[+this.type - 1].$refs.tableTarget.clickCurrentRow(index);							
						}
						
					}, 500);
				}
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
			this.$router.replace(getHashUrl('/sale/customer/deal/contract', { ...query }));
		},
		handleChangePageSize() {
			this.$store.commit('SALE_CUSTOMER_DEAL_CONTRACT_LIST_INIT');
		},
		handleWatchVideo(title, urlType) {
			VideoModal.popup({
				title,
				urlType
			}).then((res) => {

			});
		},
	}
};
</script>

<style lang="scss">
.v-sale-customer-deal-contract-list{
	.ivu-table-cell{
		white-space: nowrap;
	}
	._supply{
		height: 18px;
		width: 32px;
		background-color: #e84c57;
		color: white;
		padding: 1px 4px;
		border-radius: 2px;
		margin-right: 5px;
	}
	._full-colum{
		.ivu-table-cell{
			padding: 0;
			& > div{
				height: 38px;
				padding: 10px 18px;
			}
		}

	}
}
</style>
