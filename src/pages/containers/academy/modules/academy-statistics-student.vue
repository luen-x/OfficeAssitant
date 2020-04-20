<template>
	<set-title title="学员数据" class="g-tabs-card" style="padding: 20px">
		<oa-filter />
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/academy/statistics-student/list';
import Filter from '@components/academy/statistics-student/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-academy-statistics-student',
	components: {
		"oa-list": List,
		"oa-filter": Filter
	},
	mixins: [navigator('ACADEMY_STATISTICS_STUDENT')]
};
</script>

<style lang="scss" scoped>
</style>