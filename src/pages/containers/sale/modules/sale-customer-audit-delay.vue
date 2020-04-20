<template>
	<set-title title="延期审核" class="g-tabs-card" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/sale/customer-audit-delay/tabs-list';
import Filter from '@components/sale/customer-audit-delay/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-sale-customer-audit-delay',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('SALE_CUSTOMER_AUDIT_DELAY')],
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
