<template>
	<set-title :routes="routes" title="课程数据">
		<oa-tpl />
	</set-title>
</template>

<script>

import Tpl from '@components/academy/statistics-course-trend/content';

export default {
	name: 'oa-academy-statistics-trend',
	components: {
		'oa-tpl': Tpl
	},
	data() {
		return {
			routes: [
				{
					name: '趋势图'
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
