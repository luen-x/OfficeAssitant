<template>
	<set-title class="g-tabs-card" title="退款数据统计" style="padding: 20px">
		<oa-content />
	</set-title>
</template>

<script>

import Content from '@components/statistics/deal-refund/content';

export default {
	name: 'oa-statistics-deal-refund',
	components: {
		'oa-content': Content
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
