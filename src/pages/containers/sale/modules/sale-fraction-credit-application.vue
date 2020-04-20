<template>
	<set-title :routes="routes" title="学分申请" class="g-tabs-card g-hide-scroll" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/sale/fraction-credit-application/tabs-list';
import Filter from '@components/sale/fraction-credit-application/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-sale-fraction-credit-application',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('SALE_FRACTION_CREDIT_APPLICATION')],
	data() {
		return {
			routes: [
				{
					path: '/sale/fraction/credit',
					name: '积分学分'
				},
				{
					path: '',
					name: '学分申请',
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
