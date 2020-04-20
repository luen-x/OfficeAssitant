<template>
	<set-title title="员工考勤" style="padding: 20px">
		<oa-filter />
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/hr/employee-check/list';
import Filter from '@components/hr/employee-check/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-employee-check',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('HR_EMPLOYEE_CHECK')],
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
