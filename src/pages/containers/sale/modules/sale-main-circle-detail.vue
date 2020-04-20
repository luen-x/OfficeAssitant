<template>
	<set-title :routes="routes" title="发圈素材详情">
		<oa-tpl />
	</set-title>
</template>

<script>

import Tpl from '@components/sale/main-circle-detail/content';

export default {
	name: 'oa-sale-main-circle-detail',
	components: {
		'oa-tpl': Tpl
	},
	data() {
		return {
			routes: [
				{
					path: `/sale/main`,
					name: '首页'
				},
				{
					path: '/sale/main/circle',
					name: '发圈素材'
				},
				{
					path: '/sale/main/circle/detail',
					name: '发圈素材详情'
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
