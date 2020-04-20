<template>
	<set-title title="成交客户" class="g-tabs-card" style="padding: 20px">
		<oa-filter />
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/finance/customer-nego/list';
import Filter from '@components/finance/customer-nego/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-finance-customer-nego',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('FINANCE_CUSTOMER_NEGO')],
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
