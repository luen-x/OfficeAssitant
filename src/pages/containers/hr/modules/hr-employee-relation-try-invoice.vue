<template>
	<set-title
		:routes="$route.query.from==='person'?[]:routes"
		title="试用转正-转正单据"
		class="g-tabs-card"
		style="padding: 20px;">
		<oa-content />
	</set-title>
</template>

<script>

import Content from '@components/hr/employee-relation-try-invoice/content';

export default {
	name: 'oa-hr-employee-relation-try-invoice',
	components: {
		'oa-content': Content
	},
	data() {
		return {
			routes: [
				{
					path: `/hr/employee/relation/try`,
					name: '试用转正'
				},
				{
					path: '',
					name: '转正单据'
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
