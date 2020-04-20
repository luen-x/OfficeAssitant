<template>
	<set-title title="项目需求" style="padding: 20px">
		<oa-filter />
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/content/product-set-project/list';
import Filter from '@components/content/product-set-project/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-content-product-set-project',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('CONTENT_PRODUCT_SET_PROJECT')],
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
