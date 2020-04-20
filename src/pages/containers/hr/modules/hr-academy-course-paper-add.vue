<template>
	<set-title :routes="routes" style="padding:20px">
		<oa-container/>
	</set-title>
</template>

<script>
import navigator from '@extends/mixins/navigator';
import Container from '@components/hr/academy-course-paper-add/container';

export default {
	name: 'oa-hr-academy-course-paper-add',
	components: {
		'oa-container': Container
	},
	mixins: [navigator('HR_ACADEMY_COURSE_PAPER_ADD'), 
		navigator('HR_ACADEMY_COURSE_QUESTION')],
	data() {
		return {
			
		};
	},
	computed: {
		routes() {
			return [
				{ path: '/hr/academy/course/paper', name: '试卷库' },
				{ name: this.handleGetTitle(), path: '' }];
		}
	},
	watch: {
		'$route.query.paper_type': {
			handler(paper_type) {
				document.title = this.handleGetTitle();
			},
			immediate: true
		}
	},
	created() {
	},
	methods: {
		handleGetTitle() {
			return this.$route.query.paper_type === 'random' ? '随机试卷' : '新建试卷';
		}
	},
};
</script>

<style lang="scss" scoped>
</style>
