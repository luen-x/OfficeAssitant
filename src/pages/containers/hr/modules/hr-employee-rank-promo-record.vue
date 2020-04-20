<template>
	<set-title
		:routes="routes"
		:class="oneTab ? '' : 'g-tabs-card'"
		title="级称体系-晋级历史"
		style="padding: 20px">
		<oa-tabs-list ref="list" @handleLengthChange="handleTabChange"/>
	</set-title>
</template>

<script>
import TabsList from '@components/hr/employee-rank-promo-record/tabs-list';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-employee-rank-promo-record',
	components: {
		"oa-tabs-list": TabsList,
	},
	mixins: [navigator('HR_EMPLOYEE_RANK_PROMO_RECORD')],
	data() {
		let params = this.$route.params || {};
		return {
			routes: [
				{
					path: `/hr/employee/rank/promo`,
					name: '晋升晋级'
				},
				{
					path: '',
					name: '晋级历史'
				}
			],
			oneTab: true
		};
	},
	created() {
	},
	methods: {
		handleTabChange() {
			this.oneTab = !(this.$refs.list.tabs.length > 1);
		}
	},
};
</script>

<style lang="scss" scoped>
</style>
