<template>
	<set-title title="服务质检" class="g-tabs-card" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/sc/service-inspection/tabs-list';
import Filter from '@components/sc/service-inspection/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-sc-service-inspection',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter
	},
	mixins: [navigator('SC_SERVICE_INSPECTION')]
};
</script>

<style lang="scss" scoped>
</style>