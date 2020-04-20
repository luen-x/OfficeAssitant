<template>
	<div>
		<oa-filter
			:id="ic_system_id"
			name="学分" 
			path="/hr/employee/score/credit"
			commit="HR_EMPLOYEE_SCORE_CREDIT_LIST_INIT"
		/>
		<oa-tabs-list 
			:tabs="tabs"
			:list-info="listInfo"
			:load-data="loadData"
			:handle-change="handleChange"
			:current="current"
			:type="ic_system_id"
			:handle-change-page-size="handleChangePageSize"
			:cate="2"
		/>
	</div>
</template>

<script>
import { Tabs, TabPane } from 'iview';
import { Paging } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';

import Filter from '@components/hr/_common/employee-credit-integration/main/filter';
import TabsList from '@components/hr/_common/employee-credit-integration/main/tabs-list';


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
			return this.$store.state.hrEmployeeScoreCredit.listInfo;
		},
		tabs() {
			return this.$store.state.hrEmployeeScoreCredit.tabs;
		},
		ic_system_id() {
			const { query } = this.$route;
			return query.ic_system_id || this.$store.state.hrEmployeeScoreCredit.ic_system_id;
		}
	},
	created() {
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'HR_EMPLOYEE_SCORE_CREDIT_LIST_GET',
				type: 'GET',
				param: {
					...query,
					cate: 2,
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
			this.$router.replace(getHashUrl('/hr/employee/score/credit', { ...query }));
			this.$store.commit('HR_EMPLOYEE_CREDIT_SYSTEM_ID_SET', ic_system_id + "");
		},
		handleChangePageSize() {
			this.$store.commit('HR_EMPLOYEE_SCORE_CREDIT_LIST_INIT');
		}
	}
};

</script>

<style lang="scss">

</style>
