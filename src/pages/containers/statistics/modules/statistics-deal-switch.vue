<template>
	<set-title title="客户转手率">
		<oa-content />
	</set-title>
</template>

<script>

import Content from '@components/statistics/deal-switch/content';

export default {
	name: 'oa-statistics-deal-switch',
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
