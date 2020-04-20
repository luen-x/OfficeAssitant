<template>
	<set-title title="考试结果" class="g-tabs-card" style="padding: 20px">
		<oa-header/>
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/hr/academy-train-detail-paper-3-result/tabs-list';
import Filter from '@components/hr/academy-train-detail-paper-3-result/filter';
import Header from '@components/hr/academy-train-detail-paper-3-result/header';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-academy-train-detail-paper-3-result',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
		"oa-header": Header
	},
	mixins: [navigator('HR_ACADEMY_TRAIN_DETAIL_PAPER_3_RESULT')],
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
