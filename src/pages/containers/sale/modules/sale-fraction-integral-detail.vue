<template>
	<set-title :routes="routes" title="积分详情">
		<oa-fraction-integral-detail />
	</set-title>
</template>

<script>

import FractionIntegralDetail from '@components/sale/fraction-integral-detail';

export default {
	name: 'oa-sale-fraction-integral-detail',
	components: {
		'oa-fraction-integral-detail': FractionIntegralDetail
	},
	data() {
		return {
			routes: [
				{
					path: '/sale/fraction/integral',
					name: '积分学分'
				},
				{
					path: '/sale/fraction/integral/sub',
					name: '下级积分'
				},
				{
					path: '',
					name: '积分详情'
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
