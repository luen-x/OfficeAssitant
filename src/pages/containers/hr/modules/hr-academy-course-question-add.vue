<template>
	<set-title :routes="routes" title="">
		<oa-tpl />
	</set-title>
</template>

<script>

import Tpl from '@components/hr/academy-course-question-add/__tpl__';

const route = [
	{
		name: "我的学习",
		path: '/sale/train/study'

	},
	{
		name: "出题审核",
		path: '/sale/train/study/audit'

	},
	{ 
		name: '题库',
		path: '/hr/academy/course/question'
	}

];
const actionName = {
	add: '新建题目',
	readd: '重新申请'
};
export default {
	name: 'oa-hr-academy-course-question-add',
	components: {
		'oa-tpl': Tpl
	},
	data() {

		return {
			routes: this.getRoutes()
		};
	},
	created() {
		if (this.$route.query.action == 'readd') {
			document.title = '重新申请';
		} else {
			document.title = '新建题目';
		}
	},
	methods: {
		getRoutes() {
			const path = (this.$route.query.pathName || '题库').split(',')
				.map(item => route.find(it => it.name == item)).filter(Boolean);
			return [...path, { name: actionName[this.$route.query.action || 'add'], path: '' }];
		}
	},
};
</script>

<style lang="scss" scoped>
</style>
