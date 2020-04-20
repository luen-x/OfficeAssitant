<template>
	<set-title title="职位设置" class="g-tabs-card" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/hr/position/tabs-list';
import Filter from '@components/hr/position/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-position',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('HR_POSITION')],
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
