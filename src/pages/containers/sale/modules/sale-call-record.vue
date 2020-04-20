<template>
	<set-title title="通话记录" class="g-tabs-card" style="padding: 20px; padding-bottom: 60px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/sale/call-record/tabs-list';
import Filter from '@components/sale/call-record/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-sale-call-record',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('SALE_CALL_RECORD')],
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
