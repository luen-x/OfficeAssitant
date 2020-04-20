<template>
	<set-title title="客户合同" class="g-tabs-card" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/collage/customer-cooperate/tabs-list';
import Filter from '@components/collage/customer-cooperate/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-collage-customer-cooperate',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('COLLAGE_CUSTOMER_COOPERATE')],
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
