<template>
	<set-title :routes="routes" title="案例详情">
		<oa-content />
	</set-title>
</template>

<script>

import Content from '@components/sale/main-case-detail/content';

export default {
	name: 'oa-sale-main-case-detail',
	components: {
		'oa-content': Content
	},
	data() {
		return {
			routes: [
				{
					path: `/sale/main`,
					name: '首页'
				},
				{
					path: '/sale/main/case',
					name: '更多案例'
				},
				{
					path: '/sale/main/case/detail',
					name: '案例详情'
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
