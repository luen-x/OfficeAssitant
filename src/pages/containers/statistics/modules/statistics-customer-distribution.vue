<template>
	<set-title title="客户分布统计">
		<oa-distribution />
	</set-title>
</template>

<script>

import Distribution from '@components/statistics/customer-distribution/distribution';

export default {
	name: 'oa-statistics-customer-distribution',
	components: {
		'oa-distribution': Distribution
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
