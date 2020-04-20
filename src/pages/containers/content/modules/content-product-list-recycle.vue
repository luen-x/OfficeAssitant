<template>
	<set-title :routes="routes" title="产品恢复" style="padding: 20px">
		<oa-filter />
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/content/product-list-recycle/list';
import Filter from '@components/content/product-list-recycle/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-content-product-list-recycle',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('CONTENT_PRODUCT_LIST_RECYCLE')],
	data() {
		return {
			routes: [
				{
					path: '',
					name: '回收站'
				}
			],
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
