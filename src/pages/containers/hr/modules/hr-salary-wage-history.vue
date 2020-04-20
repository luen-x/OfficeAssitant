<template>
	<set-title title="员工薪资-调整历史" style="padding: 20px">
		<oa-filter />
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/hr/salary-wage-history/list';
import Filter from '@components/hr/salary-wage-history/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-salary-wage-history',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('HR_SALARY_WAGE_HISTORY')],
	data() {
		return {
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
