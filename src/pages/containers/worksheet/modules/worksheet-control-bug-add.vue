<template>
	<set-title :routes="routes" :title="$route.query.edit ? '编辑bug' : '创建bug'">
		<oa-tpl />
	</set-title>
</template>

<script>

import Tpl from '@components/worksheet/control-bug-add/content';

export default {
	name: 'oa-worksheet-control-bug-add',
	components: {
		'oa-tpl': Tpl
	},
	data() {
		const { query = {} } = this.$route;

		return {
			routes: [
				{
					path: '',
					name: query.edit ? '编辑bug' : '创建bug'
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
