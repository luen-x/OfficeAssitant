<template>
	<set-title title="流程管理" style="padding: 20px">
		<oa-filter />
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/content/product-set-process/list';
import Filter from '@components/content/product-set-process/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-content-product-set-process',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('CONTENT_PRODUCT_SET_PROCESS')],
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
