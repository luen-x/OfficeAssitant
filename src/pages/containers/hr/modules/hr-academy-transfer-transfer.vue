<template>
	<set-title title="新人输送-新人输送" class="g-tabs-card g-of-h" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/hr/academy-transfer-transfer/tabs-list';
import Filter from '@components/hr/academy-transfer-transfer/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-academy-transfer-transfer',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('HR_ACADEMY_TRANSFER_TRANSFER')],
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
