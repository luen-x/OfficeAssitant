<template>
	<set-title :routes="routes" title="确认资料领取">
		<oa-tpl />
	</set-title>
</template>

<script>

import Tpl from '@components/sale/customer-intention-add-sea/index';

export default {
	name: 'oa-sale-customer-intention-add-sea',
	components: {
		'oa-tpl': Tpl
	},
	data() {
		return {
			routes: [{ name: '添加资料', path: "/sale/customer/intention/add" }, { name: '确认资料领取', path: '' }]
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
