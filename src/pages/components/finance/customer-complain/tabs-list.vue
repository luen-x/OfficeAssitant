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
			:label="`${item.label}${count[index]}`"
			:name="item.value"
		>
			<vc-paging
				ref="tableTarget"
				:columns="columns"
				:show="item.value == type"
				:type="item.value"
				:data-source="listInfo[item.value].data"
				:total="listInfo[item.value].total"
				:reset="listInfo[item.value].reset"
				:current.sync="current[item.value]"
				:history="true"
				:load-data="loadData"
				:table-opts="{height: tableHeight, highlightRow: true}"
				class="v-finance-customer-complain-list"
				mode="table"
				@page-size-change="handleChangePageSize"
			/>
		</i-tab-pane>
	</i-tabs>
</template>

<script>
import { Tabs, TabPane } from 'iview';
import { Paging } from 'wya-vc';
import { tableHeight } from '@extends/mixins/tableHeight';
import { getParseUrl, getHashUrl } from '@utils/utils';
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
			nav1: true,
			nav2: false,
			extra: 50
		}),
		autoFix()
	],
	data() {
		const { query } = this.$route;

		return {
			type: String(query.type || "1"), // 同tabs下的value
			current: {},
			count: [0, 0, 0], // tab上的数字
			tabs: [
				{ label: '待审核', value: '1' },
				{ label: '已通过', value: '2' },
				{ label: '未通过', value: '3' }
			],
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.financeCustomerComplain.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'FINANCE_CUSTOMER_COMPLAIN_LIST_GET',
				type: 'GET',
				param: {
					...query,
					type: this.type,
					page,
					pageSize
				},
			}).then((res) => {
				this.count = res.data.count;
				this.resetType('1', this.count, '/finance/services/complain');
			}).catch((error) => {
				this.$Message.error(error.msg);
			});
		},
		handleChange(type) {
			this.type = type;

			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			query = {
				...query,
				type,
				fixPosition: false,
				page: this.current[type]
			};
			this.$router.replace(getHashUrl('/finance/services/complain', { ...query }));

			this.$nextTick(() => {
				this.$refs.tableTarget[+type - 1].$refs.tableTarget.handleResize();
			});
		},
		handleChangePageSize() {
			this.$store.commit('FINANCE_CUSTOMER_COMPLAIN_LIST_INIT');
		}
	}
};

</script>

<style lang="scss">
.v-finance-customer-complain-list {
	.ivu-table-cell {
		white-space: nowrap;
	}
}
</style>
