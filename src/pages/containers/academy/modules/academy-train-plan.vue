<template>
	<set-title title="培训安排" class="g-tabs-card" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/academy/train-plan/tabs-list';
import Filter from '@components/academy/train-plan/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-academy-train-plan',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('ACADEMY_TRAIN_PLAN')],
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
