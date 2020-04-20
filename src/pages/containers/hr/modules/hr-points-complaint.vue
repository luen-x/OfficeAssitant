<template>
	<set-title title="投诉记录" style="padding: 20px">
		<oa-filter />
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/hr/points-complaint/list';
import Filter from '@components/hr/points-complaint/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-points-complaint',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('HR_POINTS_COMPLAINT')],
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
