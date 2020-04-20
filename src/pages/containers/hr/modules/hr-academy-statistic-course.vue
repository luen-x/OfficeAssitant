<template>
	<set-title title="培训课程记录" class="g-tabs-card g-of-h" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/hr/academy-statistic-course/tabs-list';
import Filter from '@components/hr/academy-statistic-course/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-academy-statistic-course',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('HR_ACADEMY_STATISTIC_COURSE')],
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
