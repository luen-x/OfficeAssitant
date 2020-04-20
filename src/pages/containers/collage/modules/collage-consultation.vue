<template>
	<set-title :routes="routes" title="预览" style="padding: 0 20px 20px 20px">
		<oa-content/>
	</set-title>
</template>

<script>
import Content from '@components/collage/consultation/content';

export default {
	name: 'oa-collage-consultation',
	components: {
		'oa-content': Content
	},
	data() {
		return {
			routes: [
				{
					path: '/collage/main',
					name: '我的首页'
				},
				{
					path: '',
					name: '资讯详情'
				}
			]
		};
	}
};
</script>

<style lang="scss" scoped>
</style>