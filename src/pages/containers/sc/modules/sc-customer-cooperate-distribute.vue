<template>
	<set-title :routes="routes" title="工作概况" class="g-tabs-card" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/sc/customer-cooperate-distribute/tabs-list';
import Filter from '@components/sc/customer-cooperate-distribute/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-sc-customer-cooperate-distribute',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('SC_CUSTOMER_COOPERATE_DISTRIBUTE')],
	data() {
		return {
			routes: []
		};
	},
	created() {
		this.routes = [
			{
				path: +this.$route.query.flag === 1 ? '/sc/customer/cooperate' : '/sc/product',
				name: +this.$route.query.flag === 1 ? '合作客户' : '产品制作'
			},
			{
				path: '',
				name: '工作概况'
			}
		];
	}
};
</script>

<style lang="scss" scoped>
</style>