<template>
	<set-title :routes="routes" title="续费客户" class="g-tabs-card g-hide-scroll" style="padding: 20px">
		<!-- <oa-filter /> -->
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/statistic/business-customer-renew/tabs-list';
import Filter from '@components/statistic/business-customer-renew/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-statistic-business-customer-renew',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('STATISTIC_BUSINESS_CUSTOMER_RENEW')],
	data() {
		return {
			routes: [{ name: '续费客户', path: "" }]
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
