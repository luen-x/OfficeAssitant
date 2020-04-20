<template>
	<set-title :routes="routes" title="微币奖惩政策">
		<oa-tpl />
	</set-title>
</template>

<script>

import Tpl from '@components/hr/personnel-currency-rewards/content';

export default {
	name: 'oa-sale-property-coin-policy',
	components: {
		'oa-tpl': Tpl
	},
	data() {
		return {
			routes: [{ name: '微币奖惩政策' }]
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
