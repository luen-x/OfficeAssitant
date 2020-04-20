<template>
	<set-title title="业务数据" class="g-tabs-card" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/sale/customer-business/tabs-list';
import Filter from '@components/sale/customer-business/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-sale-customer-business',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('SALE_CUSTOMER_BUSINESS')],
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
