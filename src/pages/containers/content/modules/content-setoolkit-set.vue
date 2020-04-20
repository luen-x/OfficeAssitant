<template>
	<set-title title="类目设置" class="g-tabs-card" style="padding: 20px">
		<oa-filter />
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/content/setoolkit-set/list';
import Filter from '@components/content/setoolkit-set/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-content-setoolkit-set',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('CONTENT_SETOOLKIT_SET')],
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
