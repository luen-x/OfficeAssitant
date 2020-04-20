<template>
	<set-title :routes="routes" title="项目需求">
		<oa-content />
	</set-title>
</template>

<script>

import Content from '@components/content/product-newproject';

export default {
	name: 'oa-content-product-newproject',
	components: {
		'oa-content': Content
	},
	data() {
		return {
			routes: [
				{
					path: '/content/product/set/project',
					name: '项目需求列表'
				},
				{
					path: '',
					name: this.$route.query.request_id ? '编辑项目需求' : '新建项目需求'
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
