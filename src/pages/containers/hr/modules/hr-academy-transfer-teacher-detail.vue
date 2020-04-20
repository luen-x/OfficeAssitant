<template>
	<set-title
		:routes="routes"
		title="数据统计-查看"
		class="g-tabs-card"
		style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/hr/academy-transfer-teacher-detail/tabs-list';
import Filter from '@components/hr/academy-transfer-teacher-detail/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-academy-transfer-teacher-detail',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('HR_ACADEMY_TRANSFER_TEACHER_DETAIL')],
	data() {
		return {
			routes: [
				{
					path: `/hr/academy/transfer/statistic`,
					name: '数据统计'
				},
				{
					path: '',
					name: '查看'
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
