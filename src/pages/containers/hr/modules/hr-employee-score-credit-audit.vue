<template>
	<set-title :routes="route" title="学分审核" style="padding: 20px">
		<oa-filter />
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/hr/employee-score-credit-audit/list';
import Filter from '@components/hr/employee-score-credit-audit/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-employee-score-credit-audit',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('HR_EMPLOYEE_SCORE_CREDIT_AUDIT')],
	data() {
		const { query } = this.$route;
		return {
			route: [
				{
					path: '/hr/employee/score/credit',
					name: '学分体系'
				},
				{
					path: '/hr/employee/score/credit/audit',
					name: '学分审核'
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
