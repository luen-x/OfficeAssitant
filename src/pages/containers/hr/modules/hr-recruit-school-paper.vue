<template>
	<set-title title="招聘试卷" class="g-tabs-card" style="padding: 20px">
		<oa-filter />
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/hr/recruit-school-paper/list';
import Filter from '@components/hr/recruit-school-paper/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-recruit-school-paper',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('HR_RECRUIT_SCHOOL_PAPER')],
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
