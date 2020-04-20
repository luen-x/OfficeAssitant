<template>
	<set-title title="事项公海" style="padding: 20px">
		<oa-filter />
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/administration/matter-sea/list';
import Filter from '@components/administration/matter-sea/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-administration-matter-sea',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('ADMINISTRATION_MATTER_SEA')],
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
