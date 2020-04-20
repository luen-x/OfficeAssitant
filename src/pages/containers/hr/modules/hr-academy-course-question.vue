<template>
	<set-title title="题库" class="g-hide-scroll" style="padding: 20px;">
		<oa-filter />
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/hr/academy-course-question/list';
import Filter from '@components/hr/academy-course-question/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-academy-course-question',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('HR_ACADEMY_COURSE_QUESTION')],
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
