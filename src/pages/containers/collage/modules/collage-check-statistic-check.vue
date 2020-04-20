<template>
	<set-title title="质检数据" class="g-tabs-card" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/collage/check-statistic-check/tabs-list';
import Filter from '@components/collage/check-statistic-check/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-collage-check-statistic-check',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('COLLAGE_CHECK_STATISTIC_CHECK')],
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
