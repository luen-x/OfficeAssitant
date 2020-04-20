<template>
	<set-title :routes="routes" title="课程表" class="g-tabs-card" style="padding: 20px">
		<oa-tpl />
	</set-title>
</template>

<script>

import Tpl from '@components/collage/main-schedule/content';

export default {
	name: 'oa-collage-main-schedule',
	components: {
		'oa-tpl': Tpl
	},
	data() {
		return {
			routes: [
				{
					path: `/collage/main`,
					name: '首页'
				},
				{
					path: '',
					name: '课程表'
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
