<template>
	<set-title class="g-tabs-card" title="实时业绩" style="padding: 20px">
		<oa-filter />
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/sale/achievement/list';
import Filter from '@components/sale/achievement/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-sale-achievement',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('SALE_ACHIEVEMENT')],
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
