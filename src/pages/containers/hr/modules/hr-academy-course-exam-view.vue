<template>
	<set-title title="查看考试结果">
		<oa-academy-course-exam-view />
	</set-title>
</template>

<script>

import AcademyCourseExamView from '@components/hr/academy-course-exam-view';

export default {
	name: 'oa-hr-academy-course-exam-view',
	components: {
		'oa-academy-course-exam-view': AcademyCourseExamView
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
