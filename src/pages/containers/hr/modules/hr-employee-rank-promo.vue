<template>
	<set-title
		:class="oneTab ? '' : 'g-tabs-card'"
		title="晋升晋级-级称体系"
		style="padding: 20px">
		<oa-tabs-list ref="list" @handleLengthChange="handleTabChange"/>
	</set-title>
</template>

<script>
import TabsList from '@components/hr/employee-rank-promo/tabs-list';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-employee-rank-promo',
	components: {
		"oa-tabs-list": TabsList,
	},
	mixins: [navigator('HR_EMPLOYEE_RANK_PROMO')],
	data() {
		return {
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
