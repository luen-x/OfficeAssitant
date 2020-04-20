<template>
	<set-title title="级称设置" class="g-tabs-card">
		<oa-tabs-list />
	</set-title>
</template>

<script>

import TabsList from '@components/hr/rank/tabs-list';

export default {
	name: 'oa-hr-rank',
	components: {
		'oa-tabs-list': TabsList
	},
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
