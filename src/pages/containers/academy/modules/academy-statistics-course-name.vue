<template>
	<set-title 
		:routes="routes" 
		title="课程数据-课程名称" 
		class="g-tabs-card"
		style="padding: 20px"
	>
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/academy/statistics-course-name/list';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-academy-statistics-course-name',
	components: {
		"oa-list": List
	},
	mixins: [navigator('ACADEMY_STATISTICS_COURSE_NAME')],
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