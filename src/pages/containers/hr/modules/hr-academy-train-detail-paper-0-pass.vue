<template>
	<set-title title="通关试卷" class="g-tabs-card" style="padding: 20px">
		<oa-filter />
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/hr/academy-train-detail-paper-0-pass/list';
import Filter from '@components/hr/academy-train-detail-paper-0-pass/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-academy-train-detail-paper-0-pass',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('HR_ACADEMY_TRAIN_DETAIL_PAPER_0_PASS')],
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
