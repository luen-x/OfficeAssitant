<template>
	<set-title :routes="routes" title="成交客户-查看">
		<oa-content />
	</set-title>
</template>

<script>

import Content from '@components/hr/archives-employee-customer-detail/content';

export default {
	name: 'oa-hr-archives-employee-customer-detail',
	components: {
		'oa-content': Content
	},
	data() {
		return {
			routes: [
				{
					path: `/hr/archives/employee/customer`,
					name: '成交客户'
				},
				{
					path: '',
					name: '查看'
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
