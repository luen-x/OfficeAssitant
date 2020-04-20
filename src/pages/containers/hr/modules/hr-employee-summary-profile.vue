<template>
	<set-title :routes="routes" title="完善资料" style="padding: 20px,overflow-x: auto">
		<oa-content />
	</set-title>
</template>

<script>
import Content from '@components/hr/employee-summary-profile/content';

export default {
	name: 'oa-hr-employee-summary-profile',
	components: {
		"oa-content": Content,
	},
	data() {
		return {
			routes: [{
				path: '/hr/employee/summary',
				name: '员工总表'
			},
			{
				path: '',
				name: '完善资料'
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
