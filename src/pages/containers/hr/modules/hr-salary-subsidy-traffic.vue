<template>
	<set-title title="员工补贴-交通补贴" style="padding: 20px">
		<oa-filter />
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/hr/salary-subsidy-traffic/list';
import Filter from '@components/hr/salary-subsidy-traffic/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-salary-subsidy-traffic',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('HR_SALARY_SUBSIDY_TRAFFIC')],
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
