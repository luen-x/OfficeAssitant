<template>
	<set-title class="g-tabs-card" title="素材记录" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/content/config-material-record/tabs-list';
import Filter from '@components/content/config-material-record/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-content-config-material-record',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('CONTENT_CONFIG_MATERIAL_RECORD')],
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
