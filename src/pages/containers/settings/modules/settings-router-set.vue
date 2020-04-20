<template>
	<set-title title="settings-router-set" style="padding: 20px">
		<oa-filter />
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/settings/router-set/list';
import Filter from '@components/settings/router-set/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-settings-router-set',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('SETTINGS_ROUTER_SET')],
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
