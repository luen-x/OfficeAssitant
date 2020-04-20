<template>
	<set-title title="我的道具" class="g-tabs-card g-of-h" style="padding: 20px">
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/sale/property-mine/tabs-list';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-sale-property-mine',
	components: {
		"oa-tabs-list": TabsList,
	},
	mixins: [navigator('SALE_PROPERTY_MINE')],
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
