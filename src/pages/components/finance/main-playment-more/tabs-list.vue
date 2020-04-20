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
			<vc-paging
				:columns="getColumns(item.value)"
				:show="item.value == type" 
				:type="item.value"
				:table-opts="{height: tableHeight, highlightRow: true}"
				:data-source="listInfo[item.value].data"
				:total="listInfo[item.value].total"
				:reset="listInfo[item.value].reset"
				:current.sync="current[item.value]"
				:history="true"
				:load-data="loadData"
				class="v-finance-main-playment-more-list"
				mode="table"
				@page-size-change="handleChangePageSize"
			/>
		</i-tab-pane>
	</i-tabs>
</template>

<script>
import { Tabs, TabPane } from 'iview';
import { Paging } from 'wya-vc';
import { autoFix } from '@extends/mixins/auto-fix';
import { tableHeight } from '@extends/mixins/tableHeight';
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
			nav1: false,
			nav2s: false,
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
			tabs: [
				{ label: '战区', value: '1' }, 
				{ label: '部门', value: '2' }, 
				{ label: '员工', value: '3' }
			],
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.financeMainPlaymentMore.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			let depart_id = query.depart_id ? (query.depart_id + "").split(',') : [];
			return this.request({
				url: 'FINANCE_MAIN_PLAYMENT_MORE_LIST_GET',
				type: 'GET',
				param: {
					...query,
					type: this.type,
					depart_id: depart_id[depart_id.length - 1],
					page,
					pageSize
				},
			}).then((res) => {
			}).catch((error) => {
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
			this.$router.replace(getHashUrl('/finance/main/playment/more', { ...query }));
		},
		handleChangePageSize() {
			this.$store.commit('FINANCE_MAIN_PLAYMENT_MORE_LIST_INIT');
		}
	}
};

</script>

<style lang="scss">

</style>
