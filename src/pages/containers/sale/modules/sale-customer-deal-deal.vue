<template>
	<set-title title="成交客户" class="g-hide-scroll" style="padding: 20px">
		<oa-filter />
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/sale/customer-deal-deal/list';
import Filter from '@components/sale/customer-deal-deal/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-sale-customer-deal-deal',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('SALE_CUSTOMER_DEAL_DEAL')],
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
