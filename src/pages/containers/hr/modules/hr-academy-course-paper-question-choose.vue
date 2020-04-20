<template>
	<set-title title="hr-academy-course-paper-question-choose" class="g-tabs-card" style="padding: 20px">
		<!-- <oa-filter /> -->
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/hr/academy-course-paper-question-choose/list';
import Filter from '@components/hr/academy-course-paper-question-choose/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-academy-course-paper-question-choose',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('HR_ACADEMY_COURSE_PAPER_QUESTION_CHOOSE')],
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
