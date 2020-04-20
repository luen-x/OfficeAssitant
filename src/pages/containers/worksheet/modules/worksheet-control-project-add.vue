<template>
	<set-title :routes="routes" :title="title">
		<oa-tpl />
	</set-title>
</template>

<script>

import Tpl from '@components/worksheet/control-project-add/content';

export default {
	name: 'oa-worksheet-control-project-add',
	components: {
		'oa-tpl': Tpl
	},
	data() {
		const { query = {} } = this.$route;

		return {
			routes: [
				{
					path: '',
					name: query.action === 'add' ? '新建项目' : '编辑项目'
				}
			]
		};
	},
	computed: {
		title() {
			return this.$route.query.action === 'add' ? '新建项目' : '编辑项目';
		}
	},
	created() {

	},
	methods: {
	},
};
</script>

<style lang="scss">
</style>
