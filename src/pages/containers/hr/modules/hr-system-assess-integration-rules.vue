<template>
	<set-title :routes="route" title="积分规则">
		<oa-content />
	</set-title>
</template>

<script>

import Content from '@components/hr/system-assess-integration-rules/content';

export default {
	name: 'oa-hr-system-assess-integration-rules',
	components: {
		'oa-content': Content
	},
	data() {
		const { query } = this.$route;
		return {
			route: [
				{
					path: '/hr/system/assess/integration',
					name: '积分配置'
				},
				{
					path: '/hr/system/assess/integration/rules',
					name: '积分规则'
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
