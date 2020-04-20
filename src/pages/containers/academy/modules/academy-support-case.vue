<template>
	<set-title title="客户案例" class="g-tabs-card" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/academy/support-case/tabs-list';
import Filter from '@components/academy/support-case/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-academy-support-case',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('ACADEMY_SUPPORT_CASE')],
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
