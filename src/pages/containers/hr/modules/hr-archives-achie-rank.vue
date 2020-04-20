<template>
	<set-title title="业绩排名" style="padding: 20px" class="g-tabs-card">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/hr/archives-achie-rank/tabs-list';
import Filter from '@components/hr/archives-achie-rank/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-archives-achie-rank',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('HR_ARCHIVES_ACHIE_RANK')],
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
