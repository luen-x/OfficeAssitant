<template>
	<set-title v-cloak title="组合产品" style="padding: 20px">
		<oa-filter />
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/content/product-group/list';
import Filter from '@components/content/product-group/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-content-product-group',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('CONTENT_PRODUCT_GROUP')],
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
