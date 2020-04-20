<template>
	<i-tabs 
		:value="type" 
		:animated="false"
		type="card" 
		style="margin-top: 20px"
		@on-click="handleChange"
	>
		<i-tab-pane 
			v-for="item in tabs"
			:key="item.value"
			:label="`${item.label}`"
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
				class="v-sc-customer-cooperate-distribute-list"
				mode="table"
				@page-size-change="handleChangePageSize"
				@row-click="handleOpenDrawer"
			/>
		</i-tab-pane>
	</i-tabs>
</template>

<script>
import { Tabs, TabPane } from 'iview';
import { tableHeight } from "@extends/mixins/table";
import { Paging } from 'wya-vc';
import { autoFix } from '@extends/mixins/auto-fix';
import { getParseUrl, getHashUrl } from '@utils/utils';
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
			footer: true
		}),
		autoFix()
	],
	data() {
		const { query } = this.$route;

		return {
			type: String(query.type || "1"), // 同tabs下的value
			current: {},
			tabs: [
				{ label: '员工单量', value: '3' }, 
				{ label: '分配记录', value: '4' }
			]
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.scCustomerCooperateDistribute.listInfo;
		}
	},
	created() {
		if ((+this.$route.query.flag === 1 && this.$auth[1470]) || (+this.$route.query.flag === 2 && this.$auth[1477])) {
			this.tabs.unshift(
				{ label: '工作统计', value: '1' }, 
				{ label: '客户数据', value: '2' }
			);
			this.type = "1";
		} else {
			this.type = "3";
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'SC_CUSTOMER_COOPERATE_DISTRIBUTE_LIST_GET',
				type: 'GET',
				param: {
					...query,
					type: this.type,
					page,
					pageSize
				},
			}).then((res) => {
			}).catch((error) => {
				this.$Message.error(error.msg);
			});
		},

		handleChange(type) {
			this.type = type;

			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync

			query = {
				...query,
				fixPosition: false,
				type,
				page: this.current[type]
			};

			let router = ["/sc/customer/cooperate/distribute", "/sc/product/distribute"];
			
			this.$router.replace(getHashUrl(router[+this.$route.query.flag - 1], { ...query }));
		},
		
		handleChangePageSize() {
			this.$store.commit('SC_CUSTOMER_COOPERATE_DISTRIBUTE_LIST_INIT');
		}
	}
};
</script>

<style lang="scss">
</style>