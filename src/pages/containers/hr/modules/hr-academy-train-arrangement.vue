<template>
	<set-title title="培训安排" class="g-tabs-card" style="padding: 20px">
		<oa-filter />
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/hr/academy-train-arrangement/list';
import Filter from '@components/hr/academy-train-arrangement/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-academy-train-arrangement',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('HR_ACADEMY_TRAIN_ARRANGEMENT')],
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
