<template>
	<set-title :routes="routes" title="查看更多" class="g-tabs-card" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/finance/main-playment-more/tabs-list';
import Filter from '@components/finance/main-playment-more/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-finance-main-playment-more',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('FINANCE_MAIN_PLAYMENT_MORE')],
	data() {
		return {
			routes: [
				{
					path: "/finance/main",
					name: "财务首页"
				},
				{
					path: "",
					name: "查看更多"
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
