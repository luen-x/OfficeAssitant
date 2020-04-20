<template>
	<set-title :routes="routes" title="按折扣" class="g-tabs-card  g-hide-scroll" style="padding: 20px">
		<oa-filter />
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/statistic/business-customer-deal-discount/list';
import Filter from '@components/statistic/business-customer-deal-discount/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-statistic-business-customer-deal-discount',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('STATISTIC_BUSINESS_CUSTOMER_DEAL_DISCOUNT')],
	data() {
		return {
			routes: [{ name: '成交客户', path: '/statistic/business/customer' }, { name: '按折扣' }]

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
