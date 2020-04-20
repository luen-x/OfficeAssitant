<template>
	<set-title title="交接表审核" class="g-tabs-card" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/sc/customer-handover/tabs-list';
import Filter from '@components/sc/customer-handover/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-sc-customer-handover',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('SC_CUSTOMER_HANDOVER')],
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