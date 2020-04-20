<template>
	<set-title title="校招分配" class="g-tabs-card g-of-h" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/hr/personnel-member-distribution/tabs-list';
import Filter from '@components/hr/personnel-member-distribution/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-personnel-member-distribution',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('HR_PERSONNEL_MEMBER_DISTRIBUTION')],
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
