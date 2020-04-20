<template>
	<set-title :routes="routes" title="项目详情">
		<oa-tpl />
	</set-title>
</template>

<script>

import Tpl from '@components/worksheet/control-project-detail/content';

export default {
	name: 'oa-worksheet-control-project-detail',
	components: {
		'oa-tpl': Tpl
	},
	data() {
		const { query = {} } = this.$route;

		return {
			routes: [
				{
					path: '',
					name: query.title
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
