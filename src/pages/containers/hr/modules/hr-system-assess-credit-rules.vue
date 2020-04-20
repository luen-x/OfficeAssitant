<template>
	<set-title :routes="route" title="学分规则">
		<oa-content />
	</set-title>
</template>

<script>

import Content from '@components/hr/system-assess-credit-rules/content';

export default {
	name: 'oa-hr-system-assess-credit-rules',
	components: {
		'oa-content': Content
	},
	data() {
		const { query } = this.$route;
		return {
			route: [
				{
					path: '/hr/system/assess/credit',
					name: '学分配置'
				},
				{
					path: '/hr/system/assess/credit/rules',
					name: '学分规则'
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
