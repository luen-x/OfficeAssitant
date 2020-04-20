<template>
	<set-title title="人事总表" class="g-tabs-card g-hide-scroll" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list/>
	</set-title>
</template>

<script>
import TabsList from '@components/hr/employee-summary/tabs-list';
import Filter from '@components/hr/employee-summary/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-summary',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('HR_SUMMARY')],
	data() {
		return {
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
