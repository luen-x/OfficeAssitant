<template>
	<set-title title="质检数据">
		<oa-quality-data />
	</set-title>
</template>

<script>

import QualityData from '@components/statistics/quality-data/content';

export default {
	name: 'oa-statistics-quality-data',
	components: {
		'oa-quality-data': QualityData
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
