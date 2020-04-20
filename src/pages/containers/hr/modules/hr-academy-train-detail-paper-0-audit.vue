<template>
	<set-title title="审核考试" class="g-tabs-card" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/hr/academy-train-detail-paper-0-audit/tabs-list';
import Filter from '@components/hr/academy-train-detail-paper-0-audit/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-academy-train-detail-paper-0-audit',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('HR_ACADEMY_TRAIN_DETAIL_PAPER_0_AUDIT')],
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
