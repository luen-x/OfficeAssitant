<template>
	<set-title :routes="routes" :title="$route.query.title" style="padding: 20px">
		<oa-content />
	</set-title>
</template>

<script>
import Content from '@components/tech/project-plan-demand-add/content';

export default {
	name: 'oa-tech-project-plan-demand-add',
	components: {
		"oa-content": Content,
	},
	data() {
		return {
			routes: [
				{
					path: '',
					name: this.$route.query.title
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
