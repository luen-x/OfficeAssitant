<template>
	<set-title title="课程库" class="g-tabs-card g-hide-scroll" style="padding: 20px;">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/hr/academy-course-store/tabs-list';
import Filter from '@components/hr/academy-course-store/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-academy-course-store',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('HR_ACADEMY_COURSE_STORE')],
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
