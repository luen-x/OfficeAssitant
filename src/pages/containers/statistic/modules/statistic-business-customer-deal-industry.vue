<template>
	<set-title :routes="routes" title="按行业" class="g-tabs-card  g-hide-scroll" style="padding: 20px">
		<oa-filter />
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/statistic/business-customer-deal-industry/list';
import Filter from '@components/statistic/business-customer-deal-industry/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-statistic-business-customer-deal-industry',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('STATISTIC_BUSINESS_CUSTOMER_DEAL_INDUSTRY')],
	data() {
		return {			
			routes: [{ name: '成交客户', path: '/statistic/business/customer' }, { name: '按行业', path: "" }]

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
