<template>
	<set-title :routes="routes" title="流程管理">
		<oa-content />
	</set-title>
</template>

<script>

import Content from '@components/content/product-newprocess';

export default {
	name: 'oa-content-product-newprocess',
	components: {
		'oa-content': Content
	},
	data() {
		return {
			routes: [
				{
					path: '/content/product/set/process',
					name: '流程管理'
				},
				{
					path: '',
					name: '新建流程'
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
