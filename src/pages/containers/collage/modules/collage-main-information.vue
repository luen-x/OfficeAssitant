<template>
	<set-title :routes="routes" title="资讯列表">
		<oa-tpl />
	</set-title>
</template>

<script>

import Tpl from '@components/collage/main-information/content';

export default {
	name: 'oa-collage-main-information',
	components: {
		'oa-tpl': Tpl
	},
	data() {
		return {
			routes: [
				{
					path: `/collage/main`,
					name: '我的首页'
				},
				{
					path: `/collage/main/information`,
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
