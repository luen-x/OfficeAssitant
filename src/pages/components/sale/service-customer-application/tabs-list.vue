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
			:label="item.label + listInfo.count[+item.value - 1]" 
			:name="item.value"
		>
			<vc-paging
				ref="tableTarget"
				:columns="columns"
				:show="item.value === type" 
				:type="item.value"
				:data-source="listInfo[item.value].data"
				:total="listInfo[item.value].total"
				:reset="listInfo[item.value].reset"
				:current.sync="current[item.value]"
				:history="true"
				:load-data="loadData"
				:table-opts="{height: tableHeight, highlightRow: true}"
				class="v-sale-service-application-list"
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
import { tableHeight } from '@extends/mixins/tableHeight';
import { autoFix } from '@extends/mixins/auto-fix';
import { getParseUrl, getHashUrl } from '@utils/utils';
// item
import item from './item';

export default {
	name: 'oa-service-application-list',
	components: {
		'vc-paging': Paging,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
	},
	mixins: [
		item,
		tableHeight({
			nav1: false,
			nav2: false,
			extra: 50
		}),
		autoFix()
	],
	data() {
		const { query } = this.$route;

		return {
			type: String(query.type || (this.$auth[483] ? "1" : "3")), // 同tabs下的value
			current: {},
			tabs: this.$auth[483] ? [
				{ label: '待审核', value: '1' }, 
				{ label: '已审核', value: '2' }, 
				{ label: '我的申请', value: '3' }
			] : [
				{ label: '我的申请', value: '3' }
			]
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.saleServiceCustomerApplication.listInfo;
		}
	},
	mounted() {
		this.$vc.on('query-change', () => {
			let { query = {} } = getParseUrl();
			this.type = String(query.type);
			this.$store.commit('SALE_SERVICE_CUSTOMER_APPLICATION_LIST_INIT');
		});
	},
	beforeDestroy() {
		this.$vc.off('query-change');
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'SALE_SERVICE_CUSTOMER_APPLICATION_LIST_GET',
				type: 'GET',
				param: {
					...query,
					type: this.type,
					page,
					pageSize
				},
			}).then((res) => {
				this.$auth[483] && this.resetType('1', this.listInfo.count, '/sale/service/customer/application');
			}).catch((error) => {
				console.error(error);
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
			this.$router.replace(getHashUrl('/sale/service/customer/application', { ...query }));

			this.$nextTick(() => {
				this.$refs.tableTarget[+type - 1].$refs.tableTarget.handleResize();
			});
		},
		handleChangePageSize() {
			this.$store.commit('SALE_SERVICE_CUSTOMER_APPLICATION_LIST_INIT');
		}
	}
};

</script>

<style lang="scss">
.v-sale-service-application-list {
	.ivu-table-cell {
		white-space: nowrap;
	}
}
</style>
