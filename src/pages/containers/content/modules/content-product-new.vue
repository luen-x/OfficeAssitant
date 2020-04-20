<template>
	<set-title
		:routes="routes"
		title="新建产品"
		style="padding: 20px; margin-top: 25px">
		<oa-content />
	</set-title>
</template>

<script>
import Content from '@components/content/product-new/content';

export default {
	name: 'oa-content-product-new',
	components: {
		"oa-content": Content,
	},
	data() {
		return {
			routes: [
				{
					path: '/content/product/list',
					name: '产品列表'
				},
				{
					path: '',
					name: this.$route.fullPath.includes('product_id') ? '产品编辑' : '新建产品'
				}
			],
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
