<template>
	<set-title title="校招统计" class="g-tabs-card g-of-h" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/hr/recruit-school-statistics/tabs-list';
import Filter from '@components/hr/recruit-school-statistics/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-recruit-school-statistics',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('HR_RECRUIT_SCHOOL_STATISTICS')],
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
