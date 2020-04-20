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
			:label="item.label + listInfo.count[index]"
			:name="item.value"
		>
			<vc-paging
				:ref="'table' + item.value"
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
				class="v-hr-employee-score-service-examine-list"
				mode="table"
				@page-size-change="handleChangePageSize"
				@page-change="handlePageChange"
				@row-click="handleOpenDrawer"
				@sort-change="handleSortChange"
			/>
		</i-tab-pane>
	</i-tabs>
</template>

<script>
import { Tabs, TabPane } from 'iview';
import { Paging } from 'wya-vc';
import { autoFix } from '@extends/mixins/auto-fix';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { tableHeight } from '@extends/mixins/tableHeight';
import { tableSort } from '@extends/mixins/tableSort';
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
		tableHeight({ nav1: true, nav2: true, tab: true, extra: 20 }),
		tableSort({ columnName: 'columns' }),
		autoFix()
	],

	data() {
		const { query } = this.$route;

		return {
			type: String(query.type || "1"), // 同tabs下的value
			current: {},
			tabs: [
				{ label: "待确认", value: "1" }, 
				{ label: "已确认", value: "2" }
			],
			curPage: 1,
			sort: String(query.sort || ""),
		};
	},

	computed: {
		listInfo() {
			return this.$store.state.hrEmployeeScoreServiceExamine.listInfo;
		},
	},
	
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'HR_EMPLOYEE_SCORE_SERVICE_EXAMINE_LIST_GET',
				type: 'GET',
				param: {
					...query,
					type: this.type,
					page,
					pageSize
				},
			}).then((res) => {
				this.resetType('1', this.listInfo.count, '/hr/employee/score/service/examine');
			}).catch((error) => {
				console.error(error);
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
			this.$router.replace(getHashUrl('/hr/employee/score/service/examine', { ...query }));
		},

		handleChangePageSize() {
			this.$store.commit('HR_EMPLOYEE_SCORE_SERVICE_EXAMINE_LIST_INIT');
		},

		handlePageChange(page) {
			this.curPage = page;
		},

		handleSearch(event) {
			this.$router.replace(getHashUrl(
				'/hr/employee/score/service/examine', 
				{ 
					...this.$route.query, 
					fixPosition: false,
					sort: this.sort
				}
			));
			
			this.$store.commit('HR_EMPLOYEE_SCORE_SERVICE_EXAMINE_LIST_INIT');
		}
	}
};
</script>

<style lang="scss">
</style>