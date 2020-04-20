<template>
	<set-title :routes="routes" title="完善简历" style="padding: 20px">
		<oa-content />
	</set-title>
</template>

<script>
import Content from '@components/hr/employee-summary-resume/content';

export default {
	name: 'oa-hr-employee-summary-resume',
	components: {
		"oa-content": Content,
	},
	data() {
		return {
			routes: [
				{
					path: '/hr/employee/summary',
					name: '员工总表'
				},
				{
					path: '',
					name: '完善简历'
				}
			],
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
