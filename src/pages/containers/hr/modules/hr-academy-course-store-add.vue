<template>
	<set-title :routes="routes" title="新建课程" style="padding: 20px 0">
		<oa-content />
	</set-title>
</template>

<script>
import Content from '@components/hr/academy-course-store-add/content';

export default {
	name: 'oa-hr-academy-course-store-add',
	components: {
		"oa-content": Content,
	},
	data() {
		return {
			routes: [{ path: '/hr/academy/course/store', name: '课程库' }, { name: this.$route.query.action == 'update' ? '编辑课程' : '新建课程', path: '' }]
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
