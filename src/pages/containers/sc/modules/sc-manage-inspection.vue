<template>
	<set-title title="质检管理" class="g-tabs-card" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/sc/manage-inspection/tabs-list';
import Filter from '@components/sc/manage-inspection/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-sc-manage-inspection',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter
	},
	mixins: [navigator('SC_MANAGE_INSPECTION')]
};
</script>

<style lang="scss">
</style>