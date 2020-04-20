<template>
	<set-title :routes="routes" class="g-tabs-card" title="题目审核" style="padding: 20px">
		<oa-filter />
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/hr/academy-course-question-audit/tabs-list';
import Filter from '@components/hr/academy-course-question-audit/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-academy-course-question-audit',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('HR_ACADEMY_COURSE_QUESTION_AUDIT')],
	data() {
		return {
			routes: [{ path: '/hr/academy/course/question', name: '题库' }, { name: '题目审核', path: '' }]
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
