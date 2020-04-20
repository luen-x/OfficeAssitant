<template>
	<set-title class="g-tabs-card" title="权限审核" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/content/config-material-role/tabs-list';
import Filter from '@components/content/config-material-role/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-content-config-material-role',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('CONTENT_CONFIG_MATERIAL_ROLE')],
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
