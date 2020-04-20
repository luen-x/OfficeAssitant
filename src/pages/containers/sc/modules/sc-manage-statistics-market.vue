<template>
	<set-title title="市场服务数据" class="g-tabs-card" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/sc/manage-statistics-market/tabs-list';
import Filter from '@components/sc/manage-statistics-market/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-sc-manage-statistics-market',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter
	},
	mixins: [navigator('SC_MANAGE_STATISTICS_MARKET')]
};
</script>

<style lang="scss" scoped>
</style>