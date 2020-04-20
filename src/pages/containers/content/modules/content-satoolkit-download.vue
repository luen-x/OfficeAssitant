<template>
	<set-title title="下载记录" class="g-tabs-card" style="padding: 20px">
		<oa-filter />
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/content/satoolkit-download/list';
import Filter from '@components/content/satoolkit-download/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-content-satoolkit-download',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('CONTENT_SATOOLKIT_DOWNLOAD')],
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
