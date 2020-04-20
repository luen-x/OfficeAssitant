<template>
	<set-title :routes="routes" title="预览" style="padding: 0 20px 20px 20px">
		<oa-consultation/>
	</set-title>
</template>

<script>
import Consultation from '@components/sc/consultation/content';

export default {
	name: 'oa-sc-consultation',
	components: {
		'oa-consultation': Consultation
	},
	data() {
		return {
			routes: [
				{
					path: '/sc/main',
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