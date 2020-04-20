<template>
	<set-title title="师徒关系" style="padding: 20px">
		<oa-filter />
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/hr/personnel-member-relationship/list';
import Filter from '@components/hr/personnel-member-relationship/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-personnel-member-relationship',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('HR_PERSONNEL_MEMBER_RELATIONSHIP')],
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
