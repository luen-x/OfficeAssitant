<template>
	<set-title
		:routes="$route.query.from==='person'?[]:routes"
		title="离职管理-离职单据"
		class="g-tabs-card"
		style="padding: 20px;">
		<oa-content />
	</set-title>
</template>

<script>

import Content from '@components/hr/employee-relation-leave-invoice/content';

export default {
	name: 'oa-hr-employee-relation-leave-invoice',
	components: {
		'oa-content': Content
	},
	data() {
		return {
			routes: [
				{
					path: `/hr/employee/relation/leave`,
					name: '离职管理'
				},
				{
					path: '',
					name: '离职单据'
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
