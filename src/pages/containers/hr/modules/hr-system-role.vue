<template>
	<set-title title="角色管理" style="padding: 20px" class="g-tabs-card">
		<oa-filter />
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/hr/system-role/list';
import Filter from '@components/hr/system-role/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-role',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('HR_ROLE')],
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
