<template>
	<set-title title="数据统计">
		<oa-statistic-data />
	</set-title>
</template>

<script>

import StatisticData from '@components/collage/check-statistic-data/statistic-data';

export default {
	name: 'oa-collage-check-statistic-data',
	components: {
		'oa-statistic-data': StatisticData
	},
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