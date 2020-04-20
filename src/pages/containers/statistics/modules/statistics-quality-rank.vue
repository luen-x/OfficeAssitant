<template>
	<set-title title="质检排名">
		<oa-rank/>
	</set-title>
</template>

<script>

import rank from '@components/statistics/quality-rank/rank';

export default {
	name: 'oa-statistics-quality-rank',
	components: {
		'oa-rank': rank
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
