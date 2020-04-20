<template>
	<set-title title="公海档案" style="padding: 20px" class="g-hide-scroll">
		<oa-filter />
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/sale/sea-archive/list';
import Filter from '@components/sale/sea-archive/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-sale-sea-archive',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('SALE_SEA_ARCHIVE')],
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
