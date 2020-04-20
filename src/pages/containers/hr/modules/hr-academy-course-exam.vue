<template>
	<set-title title="网址答题">
		<oa-academy-course-exam />
	</set-title>
</template>

<script>

import AcademyCourseExam from '@components/hr/academy-course-exam';

export default {
	name: 'oa-hr-academy-course-exam',
	components: {
		'oa-academy-course-exam': AcademyCourseExam
	},
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
