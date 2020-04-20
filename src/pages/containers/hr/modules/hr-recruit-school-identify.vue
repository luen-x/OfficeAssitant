<template>
	<set-title
		:routes="routes"
		title="识别简历"
		style="padding: 20px">
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/hr/recruit-school-identify/list';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-recruit-school-identify',
	components: {
		"oa-list": List,
	},
	mixins: [navigator('HR_RECRUIT_SCHOOL_IDENTIFY')],
	data() {
		return {
			routes: [
				{
					path: '/hr/recruit/school/summary',
					name: '校招总表'
				},
				{
					path: '',
					name: '识别简历'
				}
			]
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
