<template>
	<i-tabs 
		:value="type" 
		:animated="false"
		type="card" 
		style="margin-top: 20px"
		@on-click="handleChange"
	>
		<i-tab-pane 
			v-for="(item, index) in tabs"
			:key="item.value"
			:label="item.label + ` ${listInfo.count[index]}`" 
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
				:table-opts="{height: tableHeight, highlightRow: true}"
				class="v-finance-customer-achi-list"
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
import { tableHeight } from '@extends/mixins/table';
import { autoFix } from '@extends/mixins/auto-fix';
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
		}),
		autoFix()
	],
	data() {
		const { query } = this.$route;

		return {
			type: String(query.type || "1"), // 同tabs下的value
			current: {},
			firstLoad: !query.type,
			tabs: [ 
				{ label: '待审核', value: '1' }, 
				{ label: '已通过', value: '2' },
				{ label: '未通过', value: '3' }
			],
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.financeCustomerAchi.listInfo;
		}
	},
	// mounted() {
	// 	this.loadData();
	// },
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			let depart_id = (query.depart_id && typeof query.depart_id === 'string') ? query.depart_id.split(',').reverse()[0] : query.depart_id;
			return this.request({
				url: 'FINANCE_CUSTOMER_ACHI_LIST_GET',
				type: 'GET',
				param: {
					...query,
					type: this.type,
					page,
					depart_id,
					pageSize
				},
			}).then((res) => {
				this.resetType('1', this.listInfo.count, '/finance/customer/achi');
			}).catch((error) => {
			});
		},
		handleChange(type) {
			this.type = type;
			this.firstLoad = false;
			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			query = {
				...query,
				type,
				fixPosition: false,
				page: this.current[type]
			};
			this.$router.replace(getHashUrl('/finance/customer/achi', { ...query }));
		},
		handleChangePageSize() {
			this.$store.commit('FINANCE_CUSTOMER_ACHI_LIST_INIT');
		}
	}
};

</script>

<style lang="scss">

</style>
