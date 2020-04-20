<template>
	<set-title title="客户合同" class="g-tabs-card" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/finance/customer-contract/tabs-list';
import Filter from '@components/finance/customer-contract/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-finance-customer-contract',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('FINANCE_CUSTOMER_CONTRACT')],
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
