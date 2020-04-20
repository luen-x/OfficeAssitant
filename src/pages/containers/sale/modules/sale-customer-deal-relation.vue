<template>
	<set-title title="关联公司申请" class="g-tabs-card g-hide-scroll" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/sale/customer-deal-relation/tabs-list';
import Filter from '@components/sale/customer-deal-relation/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-sale-customer-deal-relation',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('SALE_CUSTOMER_DEAL_RELATION')],
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
