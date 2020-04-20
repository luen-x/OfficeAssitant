<template>
	<set-title :routes="routes" title="查看记录" class="g-tabs-card" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/sale/property-coin-detail/tabs-list';
import Filter from '@components/sale/property-coin-detail/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-sale-property-coin-detail',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('SALE_PROPERTY_COIN_DETAIL')],
	data() {
		return {
			routes: [{ name: '查看记录' }]
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
