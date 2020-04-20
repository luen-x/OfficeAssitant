<template>
	<set-title class="g-tabs-card" title="开票申请" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/sale/ticket/tabs-list';
import Filter from '@components/sale/ticket/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-sale-ticket',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('SALE_TICKET')],
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
