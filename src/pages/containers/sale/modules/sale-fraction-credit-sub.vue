<template>
	<set-title :routes="routes" title="下级学分" class="g-tabs-card g-hide-scroll" style="padding: 20px">
		<oa-filter class="g-m-t-15"/>
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/sale/fraction-credit-sub/tabs-list';
import Filter from '@components/sale/fraction-credit-sub/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-sale-fraction-credit-sub',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('SALE_FRACTION_CREDIT_SUB')],
	data() {
		return {
			routes: [
				{
					path: '/sale/fraction/credit',
					name: '积分学分'
				},
				{
					path: '',
					name: '下级学分',
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
