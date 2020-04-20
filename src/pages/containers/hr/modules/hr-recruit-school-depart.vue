<template>
	<set-title
		:routes="routes"
		class="g-tabs-card"
		title="分配情况-部门详情"
		style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/hr/recruit-school-depart/tabs-list';
import Filter from '@components/hr/recruit-school-depart/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-recruit-school-depart',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('HR_RECRUIT_SCHOOL_DEPART')],
	data() {
		return {
			routes: [
				{
					path: `/hr/recruit/school/assigndetails`,
					name: '分配情况'
				},
				{
					path: '',
					name: '部门详情'
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
