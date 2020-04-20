<template>
	<set-title :routes="routes" title="服务申请" class="g-tabs-card g-hide-scroll" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/sale/service-customer-application/tabs-list';
import Filter from '@components/sale/service-customer-application/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-sale-service-customer-application',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('SALE_SERVICE_CUSTOMER_APPLICATION')],
	data() {
		return {
			routes: [
				{
					path: '',
					name: '服务申请'
				}
			]
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
