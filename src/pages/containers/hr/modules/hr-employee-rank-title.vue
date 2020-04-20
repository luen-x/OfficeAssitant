<template>
	<set-title
		:class="oneTab ? '' : 'g-tabs-card'"
		title="晋升晋级-称号体系"
		style="padding: 20px">
		<oa-tabs-list ref="list" @handleLengthChange="handleTabChange"/>
	</set-title>
</template>

<script>
import TabsList from '@components/hr/employee-rank-title/tabs-list';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-employee-rank-title',
	components: {
		"oa-tabs-list": TabsList,
	},
	mixins: [navigator('HR_EMPLOYEE_RANK_TITLE')],
	data() {
		return {
			oneTab: true
		};
	},
	mounted() {
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
