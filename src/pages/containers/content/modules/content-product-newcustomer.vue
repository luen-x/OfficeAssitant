<template>
	<set-title :routes="routes" title="客户信息">
		<oa-content />
	</set-title>
</template>

<script>

import Content from '@components/content/product-newcustomer';

export default {
	name: 'oa-content-product-newcustomer',
	components: {
		'oa-content': Content
	},
	data() {
		return {
			routes: [
				{
					path: '/content/product/set/customer',
					name: '客户信息列表'
				},
				{
					path: '',
					name: '客户信息'
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
