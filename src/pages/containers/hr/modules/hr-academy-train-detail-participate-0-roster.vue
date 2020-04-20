<template>
	<set-title title="参与人员" class="g-tabs-card" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/hr/academy-train-detail-participate-0-roster/tabs-list';
import Filter from '@components/hr/academy-train-detail-participate-0-roster/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-academy-train-detail-participate-0-roster',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('HR_ACADEMY_TRAIN_DETAIL_PARTICIPATE_0_ROSTER')],
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
