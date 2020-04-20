<template>
	<set-title :routes="routes" title="成交客户-导出" style="padding: 20px">
		<!-- <oa-filter /> -->
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/hr/archives-employee-output/list';
// import Filter from '@components/hr/archives-employee-output/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-archives-employee-output',
	components: {
		"oa-list": List,
		// "oa-filter": Filter,
	},
	mixins: [navigator('HR_ARCHIVES_EMPLOYEE_OUTPUT')],
	data() {
		return {
			routes: [
				{
					path: `/hr/archives/employee/customer`,
					name: '成交客户'
				},
				{
					path: '',
					name: '导出任务'
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
