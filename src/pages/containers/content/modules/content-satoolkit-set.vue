<template>
	<set-title title="类目设置" class="g-tabs-card" style="padding: 20px">
		<oa-filter />
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/content/satoolkit-set/list';
import Filter from '@components/content/satoolkit-set/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-content-satoolkit-set',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('CONTENT_SATOOLKIT_SET')],
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
