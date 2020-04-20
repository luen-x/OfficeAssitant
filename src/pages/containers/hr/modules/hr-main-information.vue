<template>
	<set-title :routes="routes" title="资讯列表">
		<oa-tpl />
	</set-title>
</template>

<script>

import Tpl from '@components/hr/main-information/content';

export default {
	name: 'oa-hr-main-information',
	components: {
		'oa-tpl': Tpl
	},
	data() {
		return {
			routes: [
				{
					path: `/hr/main`,
					name: '我的首页'
				},
				{
					path: `/hr/main/information`,
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
