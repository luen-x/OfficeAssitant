<template>
	<set-title title="申请权限">
		<oa-list />
	</set-title>
</template>

<script>

import List from '@components/administration/matter-setting-apply/list';

export default {
	name: 'oa-administration-matter-setting-apply',
	components: {
		'oa-list': List
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
