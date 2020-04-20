<template>
	<set-title title="产品列表" style="padding: 20px">
		<oa-filter />
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/content/product-list/list';
import Filter from '@components/content/product-list/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-content-product-list',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('CONTENT_PRODUCT_LIST')],
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
