<template>
	<set-title :routes="routes" title="">
		<oa-tpl @create="handleCreate" />
	</set-title>
</template>

<script>

import Tpl from '@components/sale/customer-deal-contract-order/content';


export default {
	name: 'oa-sale-customer-deal-contract-order',
	components: {
		'oa-tpl': Tpl
	},
	data() {
		return {
			routes: []
		};
	},
	created() {

	},
	methods: {
		handleCreate(routes) {
			this.routes = routes;
		}
	},
};
</script>

<style lang="scss" scoped>
</style>
