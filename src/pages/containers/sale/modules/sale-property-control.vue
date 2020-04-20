<template>
	<set-title title="道具管理" class="g-tabs-card g-of-h" style="padding: 20px">
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/sale/property-control/tabs-list';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-sale-property-control',
	components: {
		"oa-tabs-list": TabsList,
	},
	mixins: [navigator('SALE_PROPERTY_CONTROL')],
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
