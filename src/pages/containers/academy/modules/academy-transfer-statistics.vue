<template>
	<set-title title="新人输送-数据统计" class="g-tabs-card" style="padding: 20px">
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/academy/transfer-statistics/tabs-list';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-academy-transfer-statistics',
	components: {
		"oa-tabs-list": TabsList
	},
	mixins: [navigator('ACADEMY_TRANSFER_STATISTICS')]
};
</script>

<style lang="scss" scoped>
</style>