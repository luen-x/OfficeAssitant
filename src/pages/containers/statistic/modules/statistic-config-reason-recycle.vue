<template>
	<set-title
		:routes="routes"
		title="数据配置-回收站" 
		class="g-tabs-card" 
		style="padding: 20px"
	>
		<oa-filter class="g-m-t-20"/>
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/statistic/config-reason-recycle/list';
import Filter from '@components/statistic/config-reason-recycle/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-statistic-config-reason-recycle',
	components: {
		"oa-list": List,
		"oa-filter": Filter
	},
	mixins: [navigator('STATISTIC_CONFIG_REASON_RECYCLE')],
	data() {
		return {
			routes: [
				{
					path: '',
					name: '回收站'
				}
			]
		};
	}
};
</script>

<style lang="scss" scoped>
</style>