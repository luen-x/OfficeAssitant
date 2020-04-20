<template>
	<set-title :routes="routes" title="发布内容" style="padding: 20px">
		<oa-content />
	</set-title>
</template>

<script>
import Content from '@components/tech/project-publish-notice-add/content';

export default {
	name: 'oa-tech-project-publish-notice-add',
	components: {
		"oa-content": Content,
	},
	data() {
		return {
			routes: [
				{
					path: "",
					name: "发布内容"
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
