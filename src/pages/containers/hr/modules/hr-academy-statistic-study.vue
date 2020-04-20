<template>
	<set-title title="学员学习记录" class="g-tabs-card  g-of-h" style="padding: 20px">
		<oa-filter />
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/hr/academy-statistic-study/list';
import Filter from '@components/hr/academy-statistic-study/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-academy-statistic-study',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('HR_ACADEMY_STATISTIC_STUDY')],
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
