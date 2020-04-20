<template>
	<set-title :routes="routes" title="编辑录入到账">
		<oa-tpl />
	</set-title>
</template>

<script>

import Tpl from '@components/finance/customer-achi-edit/__tpl__';

export default {
	name: 'oa-finance-customer-achi-edit',
	components: {
		'oa-tpl': Tpl
	},
	data() {
		return {
			routes: [
				{
					path: '',
					name: '编辑录入到账'
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
