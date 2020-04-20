<template>
	<set-title :routes="routes" title="详情列表" class="g-tabs-card" style="padding: 20px">
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/sc/manage-statistics-market-detail/tabs-list';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-sc-manage-statistics-market-detail',
	components: {
		"oa-tabs-list": TabsList,
	},
	mixins: [navigator('SC_MANAGE_STATISTICS_MARKET_DETAIL')],
	data() {
		return {
			routes: [
				{
					path: "",
					name: this.$route.query.name
				}
			]
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
