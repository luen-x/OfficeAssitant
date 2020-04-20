<template>
	<set-title class="g-tabs-card" title="数据配置" style="padding: 20px">
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/hr/system-assess-statistics/tabs-list';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-system-assess-statistics',
	components: {
		"oa-tabs-list": TabsList,
	},
	mixins: [navigator('HR_SYSTEM_ASSESS_STATISTICS')],
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
