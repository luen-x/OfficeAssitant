<template>
	<set-title :routes="routes" :title="$route.query.edit ? '编辑训练课程': '新增训练课程'">
		<oa-tpl />
	</set-title>
</template>

<script>

import Tpl from '@components/academy/train-plan-manage/content';

export default {
	name: 'oa-academy-train-plan-manage',
	components: {
		'oa-tpl': Tpl
	},
	data() {
		return {
			routes: [
				{
					name: "新增训练课程"
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
