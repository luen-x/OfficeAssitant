<template>
	<set-title title="业绩统计" class="g-tabs-card" style="overflow-x: auto; min-width: 1100px">
		<oa-filter />
	</set-title>
</template>

<script>
import Filter from '@components/finance/count-achi/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-finance-count-achi',
	components: {
		'oa-filter': Filter,
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
