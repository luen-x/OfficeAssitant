<template>
	<set-title :routes="routes" :title="$route.query.edit ? '编辑培训课程': '新增培训课程'">
		<oa-tpl />
	</set-title>
</template>

<script>

import Tpl from '@components/academy/train-plan-train/content';

export default {
	name: 'oa-academy-train-plan-train',
	components: {
		'oa-tpl': Tpl
	},
	data() {
		return {
			routes: [
				{
					name: "新增培训课程"
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
