<template>
	<set-title :routes="routes" title="确认客户资料">
		<oa-tpl />
	</set-title>
</template>

<script>

import Tpl from '@components/sale/customer-intention-add-confirm/index';

export default {
	name: 'oa-sale-customer-intention-add-confirm',
	components: {
		'oa-tpl': Tpl
	},
	data() {
		return {
			routes: [{ name: '添加资料', path: "/sale/customer/intention/add" }, { name: '确认客户资料', path: '' }]
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
