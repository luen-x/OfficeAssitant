<template>
	<set-title title="申请查看" class="g-tabs-card g-hide-scroll" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/sale/fraction-material-application/tabs-list';
import Filter from '@components/sale/fraction-material-application/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-sale-fraction-material-application',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('SALE_FRACTION_MATERIAL_APPLICATION')],
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
