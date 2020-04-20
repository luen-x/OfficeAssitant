<template>
	<set-title :routes="routes" title="查看详情" style="padding: 20px">
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/hr/recruit-social-identify-detail/list';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-recruit-social-identify-detail',
	components: {
		"oa-list": List,
	},
	mixins: [navigator('HR_RECRUIT_SOCIAL_IDENTIFY_DETAIL')],
	data() {
		return {
			routes: [
				{
					path: '/hr/recruit/school/summary',
					name: '社招跟进'
				},
				{
					path: '',
					name: '查看详情'
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
