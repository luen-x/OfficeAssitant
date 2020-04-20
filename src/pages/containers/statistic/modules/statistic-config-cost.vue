<template>
	<set-title 
		title="产品成本配置" 
		class="g-tabs-card" 
		style="padding: 20px"
	>
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/statistic/config-cost/list';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-statistic-config-cost',
	components: {
		"oa-list": List
	},
	mixins: [navigator('STATISTIC_CONFIG_COST')]
};
</script>

<style lang="scss" scoped>
</style>