<template>
	<set-title :routes="routes" title="成交客户" class="g-tabs-card" style="padding: 20px">
		<oa-filter />
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/statistic/business-customer-deal/list';
import Filter from '@components/statistic/business-customer-deal/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-statistic-business-customer-deal',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('STATISTIC_BUSINESS_CUSTOMER_DEAL')],
	data() {
		return {
			routes: [{ name: '成交客户', path: '/statistic/business/customer' }, { name: '成交客户' }]
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
