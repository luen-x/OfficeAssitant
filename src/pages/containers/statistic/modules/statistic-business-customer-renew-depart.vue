<template>
	<set-title :routes="routes" title="部门续费客户" class="g-tabs-card  g-hide-scroll" style="padding: 20px">
		<oa-filter />
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/statistic/business-customer-renew-depart/list';
import Filter from '@components/statistic/business-customer-renew-depart/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-statistic-business-customer-renew-depart',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('STATISTIC_BUSINESS_CUSTOMER_RENEW_DEPART')],
	data() {
		return {
			routes: [
				{ name: '续费客户', path: "/statistic/business/customer/renew", back: true },
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
