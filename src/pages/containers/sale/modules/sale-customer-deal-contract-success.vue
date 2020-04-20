<template>
	<set-title :routes="routes" title="下单保存成功">
		<oa-tpl />
	</set-title>
</template>

<script>

import Tpl from '@components/sale/customer-deal-contract-success/content';

export default {
	name: 'oa-sale-customer-deal-contract-success',
	components: {
		'oa-tpl': Tpl
	},
	data() {
		return {
			routes: [
				{
					path: '',
					name: '下单'
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

<style lang="scss">
</style>
