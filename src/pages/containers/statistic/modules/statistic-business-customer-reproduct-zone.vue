<template>
	<set-title :routes="routes" :title="$route.query.zone_name || '战区'" class="g-tabs-card g-hide-scroll" style="padding: 20px">
		<oa-filter />
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/statistic/business-customer-reproduct-zone/list';
import Filter from '@components/statistic/business-customer-reproduct-zone/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-statistic-business-customer-reproduct-zone',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('STATISTIC_BUSINESS_CUSTOMER_REPRODUCT_ZONE')],
	data() {
		return {
			routes: [
				{ name: "续费产品", path: "/statistic/business/customer/reproduct", back: true },
				{ name: this.$route.query.zone_name, path: "" }
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
