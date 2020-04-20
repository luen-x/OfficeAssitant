<template>
	<set-title :routes="routes" title="薪资详情" class="g-tabs-card" style="padding: 20px">
		<oa-performance />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/finance/count-staff-collage-detail/tabs-list';
import Filter from '@components/collage/salary-month/filter';
import Performance from "@components/finance/count-staff-collage-detail/performance";
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-collage-salary-month',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
		"oa-performance": Performance
	},
	mixins: [navigator('COLLAGE_SALARY_MONTH')],
	data() {
		const { query = {} } = this.$route;
		const month = query.month;
		const name = query.staff_id == _global.staff.staff_id ? query.month : query.staff_name;
		return {
			routes: [
				{
					path: "/collage/salary",
					name: "薪资统计"
				},
				{
					path: "",
					name
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
