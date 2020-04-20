<template>
	<set-title :routes="routes" title="社招转化详情" class="g-tabs-card" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/hr/recruit-social-social-transform-details/tabs-list';
import Filter from '@components/hr/recruit-social-social-transform-details/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-recruit-social-social-transform-details',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('HR_RECRUIT_SOCIAL_SOCIAL_TRANSFORM_DETAILS')],
	data() {
		return {
			routes: [
				{
					path: '/hr/recruit/social/statistics',
					name: '社招统计'
				},
				{
					path: '',
					name: '查看详情'
				}
			],
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
