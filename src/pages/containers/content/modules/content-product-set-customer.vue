<template>
	<set-title title="客户信息" style="padding: 20px">
		<oa-filter />
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/content/product-set-customer/list';
import Filter from '@components/content/product-set-customer/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-content-product-set-customer',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('CONTENT_PRODUCT_SET_CUSTOMER')],
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
