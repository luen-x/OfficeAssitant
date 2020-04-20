<template>
	<set-title :routes="routes" :title="$route.query.product_name || '产品'" class="g-tabs-card g-hide-scroll" style="padding: 20px">
		<oa-filter />
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/statistic/business-customer-reproduct/list';
import Filter from '@components/statistic/business-customer-reproduct/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-statistic-business-customer-reproduct',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('STATISTIC_BUSINESS_CUSTOMER_REPRODUCT')],
	data() {
		return {
			routes: [
				{ name: this.$route.query.product_name || '产品', path: '' }
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
