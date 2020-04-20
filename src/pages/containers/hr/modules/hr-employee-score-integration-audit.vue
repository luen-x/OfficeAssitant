<template>
	<set-title :routes="route" title="员工服务" style="padding: 20px">
		<oa-filter />
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/hr/employee-score-integration-audit/list';
import Filter from '@components/hr/employee-score-integration-audit/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-employee-score-integration-audit',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('HR_EMPLOYEE_SCORE_INTEGRATION_AUDIT')],
	data() {
		const { query } = this.$route;
		return {
			route: [
				{
					path: '/hr/employee/score/service/examine',
					name: '服务审核'
				},
				{
					name: '员工服务'
				}
			]
		};
	},
	created() {
	},
	methods: {
	},
};
</script>

<style lang="scss" scoped>
</style>
