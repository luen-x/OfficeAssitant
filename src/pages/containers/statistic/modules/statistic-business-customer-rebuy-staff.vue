<template>
	<set-title :routes="routes" title="员工复购客户" class="g-tabs-card g-hide-scroll" style="padding: 20px">
		<oa-filter />
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/statistic/business-customer-rebuy-staff/list';
import Filter from '@components/statistic/business-customer-rebuy-staff/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-statistic-business-customer-rebuy-staff',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('STATISTIC_BUSINESS_CUSTOMER_REBUY_STAFF')],
	data() {
		const routes = [
			{ name: '复购客户', path: "/statistic/business/customer/rebuy", back: true },
			{ name: this.$route.query.staff_name || '员工', path: '' }
		];
		if (this.$route.query.depart_name) {
			routes.splice(1, 0, { name: this.$route.query.depart_name, path: '/statistic/business/customer/rebuy/depart', back: true });
		}
		return {
			routes
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
