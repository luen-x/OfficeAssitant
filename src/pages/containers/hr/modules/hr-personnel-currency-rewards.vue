<template>
	<set-title :routes="routes" style="position:relative" title="微币奖惩政策">
		<oa-tpl />
	</set-title>
</template>

<script>

import Tpl from '@components/hr/personnel-currency-rewards/content';

export default {
	name: 'oa-hr-personnel-currency-rewards',
	components: {
		'oa-tpl': Tpl
	},
	data() {
		return {
			routes: [
				{
					path: '',
					name: '微币奖惩政策'
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
