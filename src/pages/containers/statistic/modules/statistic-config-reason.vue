<template>
	<set-title 
		:title="'数据配置-退款原因配置'" 
		class="g-tabs-card" 
		style="padding: 20px"
	>
		<oa-filter />
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/statistic/config-reason/list';
import Filter from '@components/statistic/config-reason/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-statistic-config-reason',
	components: {
		"oa-list": List,
		"oa-filter": Filter
	},
	mixins: [navigator('STATISTIC_CONFIG_REASON')]
};
</script>

<style lang="scss" scoped>
</style>