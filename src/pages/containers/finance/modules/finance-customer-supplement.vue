<template>
	<set-title title="补款审核" class="g-tabs-card" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/finance/customer-supplement/tabs-list';
import Filter from '@components/finance/customer-supplement/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-finance-customer-supplement',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('FINANCE_CUSTOMER_SUPPLEMENT')],
	data() {
		return {
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
