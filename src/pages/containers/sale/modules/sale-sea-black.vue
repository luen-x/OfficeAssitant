<template>
	<set-title title="黑名单" class="g-tabs-card g-hide-scroll" style="padding: 20px">
		<frontend-main-filter />
		<frontend-main-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/sale/sea-black/tabs-list';
import Filter from '@components/sale/sea-black/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'frontend-main-sale-sea-black',
	components: {
		"frontend-main-tabs-list": TabsList,
		"frontend-main-filter": Filter,
	},
	mixins: [navigator('SALE_SEA_BLACK')],
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
