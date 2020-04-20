<template>
	<set-title :title="$route.query.paper_id ? '编辑试卷' : '新建试卷'">
		<oa-tpl />
	</set-title>
</template>

<script>

import Tpl from '@components/hr/academy-train-detail-paper-1-add/content';

export default {
	name: 'oa-hr-academy-train-detail-paper-1-add',
	components: {
		'oa-tpl': Tpl
	},
	data() {
		return {
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
