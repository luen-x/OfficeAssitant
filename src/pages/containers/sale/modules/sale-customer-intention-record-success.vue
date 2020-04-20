<template>
	<set-title :routes="routes" title="到账保存成功">
		<oa-tpl />
	</set-title>
</template>

<script>

import Tpl from '@components/sale/customer-intention-record-success/content';

export default {
	name: 'oa-sale-customer-intention-record-success',
	components: {
		'oa-tpl': Tpl
	},
	data() {
		return {
			routes: [
				{
					path: '',
					name: '录入到账'
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
