<template>
	<set-title title="我的微币" class="g-tabs-card" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/hr/personnel-currency/tabs-list';
import Filter from '@components/hr/personnel-currency/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-personnel-currency',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('HR_PERSONNEL_CURRENCY')],
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
