<template>
	<set-title title="预分配" class="g-tabs-card" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/sc/customer-predistribute/tabs-list';
import Filter from '@components/sc/customer-predistribute/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-sc-customer-predistribute',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('SC_CUSTOMER_PREDISTRIBUTE')],
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
