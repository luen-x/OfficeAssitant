<template>
	<set-title title="员工业绩" class="g-tabs-card" style="padding: 20px">
		<oa-filter />
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/finance/count-staff/list';
import Filter from '@components/finance/count-staff/filter';
import { getParseUrl, getHashUrl } from '@utils/utils';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-finance-count-staff',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('FINANCE_COUNT_STAFF')],
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
