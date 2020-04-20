<template>
	<set-title title="抽奖结果" class="g-tabs-card" style="padding: 20px">
		<oa-header />
		<oa-filter />
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/hr/academy-train-detail-draw-1-result/list';
import Filter from '@components/hr/academy-train-detail-draw-1-result/filter';
import Header from '@components/hr/academy-train-detail-draw-1-result/header';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-academy-train-detail-draw-1-result',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
		"oa-header": Header
	},
	mixins: [navigator('HR_ACADEMY_TRAIN_DETAIL_DRAW_1_RESULT')],
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
