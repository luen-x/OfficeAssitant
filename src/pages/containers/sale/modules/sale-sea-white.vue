<template>
	<set-title title="白名单" style="padding: 20px" class="g-hide-scroll">
		<oa-filter />
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/sale/sea-white/list';
import Filter from '@components/sale/sea-white/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-sale-sea-white',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('SALE_SEA_WHITE')],
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
