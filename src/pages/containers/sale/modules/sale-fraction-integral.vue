<template>
	<set-title title="我的积分" class="g-tabs-card" style="padding: 20px">
		<oa-fraction-integral />
	</set-title>
</template>

<script>
import FractionIntegral from '@components/sale/fraction-integral';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-sale-fraction-integral',
	components: {
		"oa-fraction-integral": FractionIntegral,
	},
	mixins: [navigator('SALE_FRACTION_INTEGRAL')],
	data() {
		return {
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
