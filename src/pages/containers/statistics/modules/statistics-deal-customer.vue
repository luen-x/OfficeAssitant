<template>
	<set-title title="成交客户统计">
		<oa-tpl />
	</set-title>
</template>

<script>

import Tpl from '@components/statistics/deal-customer/deal-customer';

export default {
	name: 'oa-statistics-deal-customer',
	components: {
		'oa-tpl': Tpl
	},
	data() {
		return {
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
