<template>
	<set-title :routes="routes" title="咨询列表">
		<oa-tpl />
	</set-title>
</template>

<script>

import Tpl from '@components/sale/full-information';

export default {
	name: 'oa-sale-full-information',
	components: {
		'oa-tpl': Tpl
	},
	data() {
		return {
			routes: [
				{
					path: `/sale/main`,
					name: '我的首页'
				},
				{
					path: `/sale/full/information`,
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
