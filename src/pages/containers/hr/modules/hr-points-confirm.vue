<template>
	<set-title title="积分确认" class="g-tabs-card" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/hr/points-confirm/tabs-list';
import Filter from '@components/hr/points-confirm/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-points-confirm',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('HR_POINTS_CONFIRM')],
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
