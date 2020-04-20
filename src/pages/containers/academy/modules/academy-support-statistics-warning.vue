<template>
	<set-title title="预警设置" class="g-tabs-card" style="padding: 20px">
		<oa-filter />
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/academy/support-statistics-warning/list';
import Filter from '@components/academy/support-statistics-warning/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-academy-support-statistics-warning',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('ACADEMY_SUPPORT_STATISTICS_WARNING')],
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
