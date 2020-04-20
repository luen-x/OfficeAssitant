<template>
	<set-title :routes="routes" title="学分详情">
		<oa-fraction-credit-detail />
	</set-title>
</template>

<script>

import FractionCreditDetail from '@components/sale/fraction-credit-detail';

export default {
	name: 'oa-sale-fraction-credit-detail',
	components: {
		'oa-fraction-credit-detail': FractionCreditDetail
	},
	data() {
		return {
			routes: [
				{
					path: '/sale/fraction/credit',
					name: '积分学分'
				},
				{
					path: '/sale/fraction/credit/sub',
					name: '下级学分',
				},
				{
					path: '',
					name: '学分详情',
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
