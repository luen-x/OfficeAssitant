<template>
	<set-title
		:routes="routes"
		class="g-tabs-card"
		title="分配情况-战区详情"
		style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/hr/recruit-school-war/tabs-list';
import Filter from '@components/hr/recruit-school-war/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-recruit-school-war',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('HR_RECRUIT_SCHOOL_WAR')],
	data() {
		return {
			routes: [
				{
					path: `/hr/recruit/school/assigndetails`,
					name: '分配情况'
				},
				{
					path: '',
					name: '战区详情'
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
