<template>
	<set-title title="我的学分" class="g-tabs-card" style="padding: 20px">
		<oa-fraction-credit />
	</set-title>
</template>

<script>
import FractionCredit from '@components/sale/fraction-credit';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-sale-fraction-credit',
	components: {
		"oa-fraction-credit": FractionCredit
	},
	mixins: [navigator('SALE_FRACTION_CREDIT')],
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
