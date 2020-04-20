<template>
	<set-title title="课程数据" class="g-tabs-card" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/academy/statistics-course/tabs-list';
import Filter from '@components/academy/statistics-course/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-academy-statistics-course',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter
	},
	mixins: [navigator('ACADEMY_STATISTICS_COURSE')]
};
</script>

<style lang="scss" scoped>
</style>