<template>
	<set-title title="业务审核" class="g-tabs-card" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/hr/archives-audit/tabs-list';
import Filter from '@components/hr/archives-audit/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-archives-audit',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('HR_ARCHIVES_AUDIT')],
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
