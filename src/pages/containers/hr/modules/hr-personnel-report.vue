<template>
	<set-title title="举报信息" class="g-tabs-card" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/hr/personnel-report/tabs-list';
import Filter from '@components/hr/personnel-report/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-personnel-report',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('HR_PERSONNEL_REPORT')],
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
