<template>
	<set-title title="我的事项" class="g-tabs-card" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/administration/matter-my/tabs-list';
import Filter from '@components/administration/matter-my/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-administration-matter-my',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('ADMINISTRATION_MATTER_MY')],
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
