<template>
	<set-title :routes="routes" title="产品组合">
		<oa-tpl />
	</set-title>
</template>

<script>

import Tpl from '@components/content/product-newgroup';

export default {
	name: 'oa-content-product-newgroup',
	components: {
		'oa-tpl': Tpl
	},
	data() {
		return {
			routes: [
				{
					path: '/content/product/group',
					name: '产品组合'
				},
				{
					path: '',
					name: this.$route.fullPath.includes('product_id') ? '编辑产品组合' : '新建产品组合'
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
