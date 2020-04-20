<template>
	<set-title :routes="routes" title="复购客户" class="g-tabs-card g-hide-scroll" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/statistic/business-customer-rebuy/tabs-list';
import Filter from '@components/statistic/business-customer-rebuy/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-statistic-business-customer-rebuy',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('STATISTIC_BUSINESS_CUSTOMER_REBUY')],
	data() {
		return {
			routes: [{ name: '复购客户', path: "" }]
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
