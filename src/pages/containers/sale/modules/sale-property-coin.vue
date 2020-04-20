<template>
	<set-title title="微币管理" class="g-tabs-card g-hide-scroll" style="padding: 20px">
		<oa-filter />
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/sale/property-coin/list';
import Filter from '@components/sale/property-coin/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-sale-property-coin',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('SALE_PROPERTY_COIN')],
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
