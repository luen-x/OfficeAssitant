<template>
	<set-title title="类目设置" style="padding: 20px">
		<oa-filter />
		<oa-list/>
	</set-title>
</template>

<script>
import List from '@components/content/config-material-set/list';
import Filter from '@components/content/config-material-set/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-content-config-material-set',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('CONTENT_CONFIG_MATERIAL_SET')],
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
