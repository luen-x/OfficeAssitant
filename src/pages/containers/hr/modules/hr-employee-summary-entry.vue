<template>
	<set-title :routes="routes" title="办理入职" style="padding: 20px,overflow-x: auto">
		<oa-content />
	</set-title>
</template>

<script>
import Content from '@components/hr/employee-summary-entry/content';

export default {
	name: 'oa-hr-employee-summary-entry',
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
				name: '办理入职'
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
