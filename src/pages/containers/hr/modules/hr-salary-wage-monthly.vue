<template>
	<set-title title="员工薪资-每月薪资" style="padding: 20px">
		<oa-filter />
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/hr/salary-wage-monthly/list';
import Filter from '@components/hr/salary-wage-monthly/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-salary-wage-monthly',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('HR_SALARY_WAGE_MONTHLY')],
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
