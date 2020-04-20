<template>
	<set-title title="预警设置" class="g-tabs-card" style="padding: 20px">
		<oa-filter />
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/content/config-statistics-warning/list';
import Filter from '@components/content/config-statistics-warning/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-content-config-statistics-warning',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('CONTENT_CONFIG_STATISTICS_WARNING')],
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
