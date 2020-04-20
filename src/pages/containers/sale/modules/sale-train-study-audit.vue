<template>
	<set-title :routes="routes" class="g-tabs-card" title="查看出题审核" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/sale/train-study-audit/tabs-list';
import Filter from '@components/sale/train-study-audit/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-sale-train-study-audit',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('SALE_TRAIN_STUDY_AUDIT')],
	data() {
		return {
			routes: [{ name: "查看出题审核" }]
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
