<template>
	<set-title :routes="route" title="发布内容" style="padding: 20px">
		<oa-content />
	</set-title>
</template>

<script>
import Content from '@components/content/information-publish-content/content';

export default {
	name: 'oa-content-information-publish-content',
	components: {
		"oa-content": Content,
	},
	data() {
		return {
			route: [
				{
					name: '资料发布',
					path: '/content/information/publish'
				},
				{
					name: '发布内容',
					path: ''
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
