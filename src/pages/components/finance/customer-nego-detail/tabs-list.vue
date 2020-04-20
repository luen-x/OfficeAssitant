<template>
	<i-tabs 
		:value="type" 
		:animated="false"
		type="card" 
		style="margin-top: 20px"
		@on-click="handleChange"
	>
		<i-tab-pane 
			v-for="(item) in tabs"
			:key="item.value"
			:label="item.label" 
			:name="item.value"
		>
			<!-- <div v-if="type === '1'">
				<span class="g-m-r-30">
					<span>可用余额</span>
					<span class="g-m-l-10" style="color: #e84c57;">{{ data.balance.total_balance_amount }}元</span>
				</span>
				<span 
					v-for="item of data.balance.balance" 
					:key="item.category_id" 
					class="g-m-r-30" 
					style="display: inline-block; margin-bottom: 16px;" >
					<span>
						{{ item.category_name }}<span v-if="item.category_name !== '其它余额'">余额</span>
					</span>
					<span class="g-m-l-10" style="color: #e84c57;">{{ item.balance_amount }}元</span>
				</span>
			</div> -->
			<vc-paging
				ref="tableTarget"
				:columns="getColumns"
				:show="item.value == type" 
				:type="item.value"
				:data-source="listInfo[item.value].data"
				:total="listInfo[item.value].total"
				:reset="listInfo[item.value].reset"
				:current.sync="current[item.value]"
				:history="true"
				:load-data="loadData"
				:table-opts="{height: tableHeight, highlightRow: true}"
				class="v-finance-customer-nego-detail-list"
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
import API_ROOT from '@stores/apis/root';
import { tableHeight } from '@extends/mixins/table';
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
		tableHeight({
			filter: true,
			tabs: true,
			footer: true,
		})
	],
	data() {
		const { query } = this.$route;

		return {
			type: String(query.type || "1"), // 同tabs下的value
			current: {},
			contract_company_id: query.contract_company_id,
			tabs: [
				{ label: '到账记录', value: '1' }, 
				{ label: '客户合同', value: '2' }, 
				{ label: '退款记录', value: '3' },
				{ label: '开票记录', value: '4' }
			],
			data: {
				balance: {}
			}
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.financeCustomerNegoDetail.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			const url = this.handleUrl();
			return this.request({
				url,
				type: 'GET',
				param: {
					...query,
					page,
					pageSize
				},
			}).then((res) => {
			}).catch((error) => {
			});
		},
		handleUrl() {
			const urlObj = {
				'1': 'FINANCE_CUSTOMER_NEGO_DETAIL_ACHI_LIST_GET',
				'2': 'FINANCE_CUSTOMER_NEGO_DETAIL_CUSTOMER_LIST_GET',
				'3': 'FINANCE_CUSTOMER_NEGO_DETAIL_REFUND_LIST_GET',
				'4': 'FINANCE_CUSTOMER_NEGO_DETAIL_TICKET_LIST_GET',
			};
			return urlObj[this.type];
		},
		handleChange(type) {
			this.type = type;

			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			query = {
				...query,
				type,
				page: this.current[type]
			};
			this.$router.replace(getHashUrl('/finance/customer/nego/detail', { ...query }));
		},
		handleChangePageSize() {
			this.$store.commit('FINANCE_CUSTOMER_NEGO_DETAIL_LIST_INIT');
		}
	}
};

</script>

<style lang="scss">

</style>
