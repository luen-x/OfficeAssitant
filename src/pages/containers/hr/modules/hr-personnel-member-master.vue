<template>
	<set-title title="微一案师傅" class="g-tabs-card" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list/>
	</set-title>
</template>

<script>
import TabsList from '@components/hr/personnel-member-master/tabs-list';
import Filter from '@components/hr/personnel-member-master/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'hr-personnel-member-master',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('HR_PERSONNEL_MEMBER_MASTER')],
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
