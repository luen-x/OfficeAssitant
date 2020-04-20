<template>
	<set-title title="参与人员" class="g-tabs-card g-pd-lr-20 g-of-h">
		<oa-filter />
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/academy/train-plan-detail-participate/list';
import Filter from '@components/academy/train-plan-detail-participate/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-academy-train-plan-detail-participate',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('ACADEMY_TRAIN_PLAN_DETAIL_PARTICIPATE')],
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
