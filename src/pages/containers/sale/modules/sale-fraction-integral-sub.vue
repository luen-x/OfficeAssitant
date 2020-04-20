<template>
	<set-title :routes="routes" title="下级积分" class="g-tabs-card g-hide-scroll" style="padding: 20px">
		<oa-filter class="g-m-t-15"/>
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/sale/fraction-integral-sub/tabs-list';
import Filter from '@components/sale/fraction-integral-sub/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-sale-fraction-integral-sub',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('SALE_FRACTION_INTEGRAL_SUB')],
	data() {
		return {
			routes: [
				{
					path: '/sale/fraction/integral',
					name: '积分学分'
				},
				{
					path: '',
					name: '下级积分'
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
