<template>
	<set-title title="人员档案" class="g-tabs-card" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/hr/archives-person/tabs-list';
import Filter from '@components/hr/archives-person/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-archives-person',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('HR_ARCHIVES_PERSON')],
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
