<template>
	<set-title title="试岗分配" class="g-tabs-card" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/hr/recruit-school-tryassign/tabs-list';
import Filter from '@components/hr/recruit-school-tryassign/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-recruit-school-tryassign',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('HR_RECRUIT_SCHOOL_TRYASSIGN')],
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
