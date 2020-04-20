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
				:columns="columns[item.value]"
				:show="item.value == type" 
				:type="item.value"
				:data-source="listInfo[item.value].data"
				:total="listInfo[item.value].total"
				:reset="listInfo[item.value].reset"
				:current.sync="current[item.value]"
				:history="true"
				:load-data="loadData"
				:table-opts="{height: tableHeight,highlightRow: true}"
				class="v-sale-customer-audit-mistake-list"
				mode="table"
				@page-size-change="handleChangePageSize"
				@row-click="handleOpenDrawer"
			/>
		</i-tab-pane>
	</i-tabs>
</template>

<script>
import { Tabs, TabPane } from 'iview';
import { Paging } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { tableHeight } from '@extends/mixins/tableHeight';
// item
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
	},
	mixins: [item, tableHeight()],
	data() {
		const { query } = this.$route;

		return {
			type: String(query.type || "2"), // 同tabs下的value
			current: {},
			tabs: [
				{ label: '待审核', value: '2' }, 
				{ label: '已通过', value: '3' }, 
				{ label: '已驳回', value: '4' }
			],
			count: [0, 0, 0]
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.saleCustomerAuditMistake.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'SALE_CUSTOMER_AUDIT_MISTAKE_LIST_GET',
				type: 'GET',
				param: {
					...query,
					type: this.type,
					page,
					pageSize
				},
			}).then((res) => {
				this.count = [res.data.default_count, res.data.success_count, res.data.error_count];
				
			}).catch((error) => {
				console.error(error, 'error');
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
			this.$router.replace(getHashUrl('/sale/customer/audit/mistake', { ...query }));
		},
		handleChangePageSize() {
			this.$store.commit('SALE_CUSTOMER_AUDIT_MISTAKE_LIST_INIT');
		}
	}
};

</script>

<style lang="scss">

</style>
