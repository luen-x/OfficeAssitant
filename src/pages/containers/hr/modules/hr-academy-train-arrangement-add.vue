<template>
	<set-title :routes="routes" title="新建项目课程">
		<oa-tpl />
	</set-title>
</template>

<script>

import Tpl from '@components/hr/academy-train-arrangement-add/content';

export default {
	name: 'oa-hr-academy-train-arrangement-add',
	components: {
		'oa-tpl': Tpl
	},
	data() {
		return {
			routes: [
				{
					path: `/hr/academy/train/arrangement`,
					name: '培训安排'
				},
				{
					path: '',
					name: '新增项目课程'
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
