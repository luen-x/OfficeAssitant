<template>
	<set-title
		:routes="routes"
		title="员工业绩详情"
		class="g-tabs-card"
		style="padding: 20px"
	>
		<oa-performance />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from "@components/finance/count-staff-collage-detail/tabs-list";
import Performance from "@components/finance/count-staff-collage-detail/performance";
import navigator from "@extends/mixins/navigator";

export default {
	name: "oa-finance-finance-count-staff-collage-detail",
	components: {
		"oa-tabs-list": TabsList,
		"oa-performance": Performance
	},
	mixins: [navigator("FINANCE_COUNT_STAFF_COLLAGE_DETAIL")],
	data() {
		const { query = {} } = this.$route;
		const name = query.staff_id == _global.staff.staff_id ? query.month : query.staff_name;
		return {
			routes: [
				{
					path: "/finance/count/staff/collage",
					name: "商学院"
				},
				{
					path: "",
					name
				}
			]
		};
	},
	created() {},
	methods: {}
};
</script>

<style lang="scss" scoped>
</style>
