<template>
	<set-title :routes="routes" title="资讯列表">
		<oa-tpl />
	</set-title>
</template>

<script>

import Tpl from '@components/finance/main-information/content';

export default {
	name: 'oa-finance-main-information',
	components: {
		'oa-tpl': Tpl
	},
	data() {
		return {
			routes: [
				{
					path: `/finance/main`,
					name: '我的首页'
				},
				{
					path: `/finance/main/information`,
					name: '资讯列表'
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
