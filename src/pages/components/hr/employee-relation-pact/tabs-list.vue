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
			:name="item.value">

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
				:table-opts="{height: tableHeight}"
				class="v-hr-employee-relation-pact-list"
				mode="table"
				@page-size-change="handleChangePageSize"
			/>
		</i-tab-pane>
	</i-tabs>
</template>

<script>
import { Tabs, TabPane } from 'iview';
import { Paging } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { tableHeight } from '@extends/mixins/tableHeight';
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
		tableHeight({ nav1: true, nav2: true, tab: true, extra: 0 }),
		autoFix()
	],
	data() {
		const { query } = this.$route;

		return {
			type: String(query.type || "1"), // 同tabs下的value
			current: {},
			tabs: [
				{ label: '待签合同', value: '1' },
				{ label: '全部合同', value: '2' }
			],
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.hrEmployeeRelationPact.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'HR_EMPLOYEE_RELATION_PACT_LIST_GET',
				type: 'GET',
				param: {
					...query,
					type: this.type,
					page,
					pageSize
				},
				loading: false
			}).then(res => {
				this.resetType('1', this.listInfo.count, '/hr/employee/relation/pact');
			}).catch(error => {});
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
			this.$nextTick(() => {
				this.$refs.tableTarget[+type - 1].$refs.tableTarget.handleResize();
			});
			this.$router.replace(getHashUrl('/hr/employee/relation/pact', { ...query }));
		},
		handleChangePageSize() {
			this.$store.commit('HR_EMPLOYEE_RELATION_PACT_LIST_INIT');
		}
	}
};

</script>

<style lang="scss">

</style>
