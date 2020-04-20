<template>
	<set-title title="资讯分类" style="padding: 20px">
		<oa-filter />
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/content/information-classify/list';
import Filter from '@components/content/information-classify/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-content-information-classify',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('CONTENT_INFORMATION_CLASSIFY')],
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
