<template>
	<set-title title="退款申请" class="g-tabs-card" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/collage/customer-refund/tabs-list';
import Filter from '@components/collage/customer-refund/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-collage-customer-refund',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('COLLAGE_CUSTOMER_REFUND')],
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
