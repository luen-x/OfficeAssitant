<template>
	<set-title title="客户合同" class="g-tabs-card g-hide-scroll" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/sale/customer-deal-contract/tabs-list';
import Filter from '@components/sale/customer-deal-contract/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-sale-customer-deal-contract',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('SALE_CUSTOMER_DEAL_CONTRACT')],
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
