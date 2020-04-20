<template>
	<set-title title="试卷库" class="g-hide-scroll" style="padding: 20px;">
		<oa-filter />
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/hr/academy-course-paper/list';
import Filter from '@components/hr/academy-course-paper/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-academy-course-paper',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('HR_ACADEMY_COURSE_PAPER')],
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
// .v-hr-academy-course-paper-container {
// 	overflow-y: hidden !important
// }
</style>
