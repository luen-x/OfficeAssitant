<template>
	<set-title :routes="routes" title="编辑试卷" style="padding:20px">
		<oa-container/>
	</set-title>
</template>

<script>

import Container from '@components/hr/academy-course-paper-edit/container';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-academy-course-paper-edit',
	components: {
		'oa-container': Container
	},
	mixins: [navigator('HR_ACADEMY_COURSE_PAPER_EDIT')],
	data() {
		return {
			routes: [{ path: '/hr/academy/course/paper', name: '试卷库' }, { name: '编辑试卷', path: '' }]
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
