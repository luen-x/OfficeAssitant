<template>
	<div>
		<oa-filter
			cate="1"
			path="/hr/employee/score/integration/rank"
			commit="HR_EMPLOYEE_SCORE_INTEGRATION_RANK_LIST_INIT"
		/>
		<oa-tabs-list 
			:tabs="tabs"
			:list-info="listInfo"
			:load-data="loadData"
			:handle-change="handleChange"
			:current="current"
			:type="ic_system_id"
			:handle-change-page-size="handleChangePageSize"
			cate="1"
		/>
	</div>
</template>

<script>
import { Tabs, TabPane } from 'iview';
import { Paging } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';

import Filter from '@components/hr/_common/employee-credit-integration/rank/filter';
import TabsList from '@components/hr/_common/employee-credit-integration/rank/tabs-list';


export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'oa-filter': Filter,
		'oa-tabs-list': TabsList,
	},
	data() {
		const { query } = this.$route;

		return {
			type: String(query.type || "1"), // 同tabs下的value
			current: {},
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.hrEmployeeScoreIntegrationRank.listInfo;
		},
		tabs() {
			return this.$store.state.hrEmployeeScoreIntegrationRank.tabs;
		},
		ic_system_id() {
			return this.$store.state.hrEmployeeScoreIntegrationRank.ic_system_id;
		}
	},
	created() {

	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'HR_EMPLOYEE_SCORE_INTEGRATION_RANK_LIST_GET',
				type: 'GET',
				param: {
					...query,
					cate: 1,
					ic_system_id: this.ic_system_id,
					page,
					pageSize
				},
			}).then((res) => {
				
			}).catch((error) => {
				console.error(error);
			});
		},
		handleChange(ic_system_id) {
			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			query = {
				...query,
				ic_system_id,
				page: this.current[ic_system_id]
			};
			this.$router.replace(getHashUrl('/hr/employee/score/integration/rank', { ...query }));
			this.$store.commit('HR_EMPLOYEE_INTEGRATION_RANK_SYSTEM_ID_SET', ic_system_id + "");
		},
		handleChangePageSize() {
			this.$store.commit('HR_EMPLOYEE_SCORE_INTEGRATION_RANK_LIST_INIT');
		}
	}
};

</script>

<style lang="scss">
</style>
