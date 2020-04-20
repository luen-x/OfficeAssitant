<template>
	<set-title 
		:routes="routes" 
		title="课程数据-课程类型" 
		class="g-tabs-card" 
		style="padding: 20px"
	>
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/academy/statistics-course-type/tabs-list';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-academy-statistics-course-type',
	components: {
		"oa-tabs-list": TabsList
	},
	mixins: [navigator('ACADEMY_STATISTICS_COURSE_TYPE')],
	data() {
		return {
			routes: []
		};
	},
	created() {
		this.routes.push(
			{
				name: this.$route.query.course_name,
				query: ""
			}
		);
	}
};
</script>

<style lang="scss" scoped>
</style>