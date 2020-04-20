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
				class="v-hr-employee-score-service-complaints-list"
				mode="table"
				@page-size-change="handleChangePageSize"
				@page-change="handlePageChange"
			/>
		</i-tab-pane>
	</i-tabs>
</template>

<script>
import { Tabs, TabPane } from 'iview';
import { tableHeight } from '@extends/mixins/tableHeight';
import { autoFix } from '@extends/mixins/auto-fix';
import { Paging } from 'wya-vc';
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
		tableHeight({ nav1: true, nav2: true, tab: true, extra: 36 }),
		autoFix()
	],
	data() {
		const { query } = this.$route;

		return {
			type: String(query.type || "1"), // 同tabs下的value
			current: {},
			tabs: [
				{ label: "待审核", value: "1" }, 
				{ label: "已通过", value: "2" }, 
				{ label: "未通过", value: "3" }
			],
			curPage: 1
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.hrEmployeeScoreServiceComplaints.listInfo;
		},

		// tableHeight() {
		// 	let len = 0;
		// 	let listInfoData = this.$store.state.hrEmployeeScoreServiceComplaints.listInfo[this.type].data[this.curPage];

		// 	for (let i in listInfoData) {
		// 		listInfoData[i] && len++;
		// 	}

		// 	let winHeight;

		// 	if (len > 15) {
		// 		// 获取窗口高度
		// 		if (window.innerHeight) {
		// 			winHeight = window.innerHeight - 380;
		// 		} else if (document.body && document.body.clientHeight) {
		// 			winHeight = document.body.clientHeight - 380;
		// 		}

		// 		return winHeight;
		// 	}
		// }
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'HR_EMPLOYEE_SCORE_SERVICE_COMPLAINTS_LIST_GET',
				type: 'GET',
				param: {
					...query,
					type: this.type,
					page,
					pageSize
				},
			}).then((res) => {
				this.resetType('1', this.listInfo.count, '/hr/employee/score/service/complaints');
			}).catch((error) => {
				console.error(error);
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
			this.$router.replace(getHashUrl('/hr/employee/score/service/complaints', { ...query }));
		},
		handleChangePageSize() {
			this.$store.commit('HR_EMPLOYEE_SCORE_SERVICE_COMPLAINTS_LIST_INIT');
		},
		
		handlePageChange(page) {
			this.curPage = page;
		}
	}
};
</script>

<style lang="scss">
</style>