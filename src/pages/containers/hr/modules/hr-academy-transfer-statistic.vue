<template>
	<set-title title="新人输送-数据统计" class="g-tabs-card" style="padding: 20px">
		<!-- <oa-filter /> -->
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/hr/academy-transfer-statistic/tabs-list';
// import Filter from '@components/hr/academy-transfer-statistic/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-hr-academy-transfer-statistic',
	components: {
		"oa-tabs-list": TabsList,
		// "oa-filter": Filter,
	},
	mixins: [navigator('HR_ACADEMY_TRANSFER_STATISTIC')],
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

