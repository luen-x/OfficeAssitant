<template>
	<set-title :routes="routes" title="添加个人客户" >
		<oa-content />
	</set-title>
</template>

<script>

import Content from '@components/sale/customer-intention-add-personal/index';

export default {
	name: 'oa-sale-customer-intention-add-personal', 
	components: {
		'oa-content': Content
	},
	data() {
		return {
			routes: [{ name: '添加个人客户', path: '' }]
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
