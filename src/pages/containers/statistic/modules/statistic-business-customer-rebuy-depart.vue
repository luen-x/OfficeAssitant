<template>
	<set-title :routes="routes" title="部门复购客户" class="g-tabs-card  g-hide-scroll" style="padding: 20px">
		<oa-filter />
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/statistic/business-customer-rebuy-depart/list';
import Filter from '@components/statistic/business-customer-rebuy-depart/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-statistic-business-customer-rebuy-depart',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('STATISTIC_BUSINESS_CUSTOMER_REBUY_DEPART')],
	data() {
		return {
			routes: [
				{ name: '复购客户', path: "/statistic/business/customer/rebuy", back: true },
				{ name: this.$route.query.depart_name || '部门', path: '' }
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
