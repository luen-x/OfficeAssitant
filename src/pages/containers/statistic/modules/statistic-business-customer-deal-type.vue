<template>
	<set-title :routes="routes" title="按类型" class="g-tabs-card  g-hide-scroll" style="padding: 20px">
		<oa-filter />
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/statistic/business-customer-deal-type/list';
import Filter from '@components/statistic/business-customer-deal-type/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-statistic-business-customer-deal-type',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('STATISTIC_BUSINESS_CUSTOMER_DEAL_TYPE')],
	data() {
		return {
			routes: [{ name: '成交客户', path: '/statistic/business/customer' }, { name: '按类型' }]

			
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
