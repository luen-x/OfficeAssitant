<template>
	<set-title v-cloak title="意向客户" class="g-hide-scroll" style="padding: 20px">
		<oa-filter />
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/sale/customer-intention/list';
import Filter from '@components/sale/customer-intention/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-sale-customer-intention',
	components: { 
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('SALE_CUSTOMER_INTENTION')],
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

<style lang="scss" >
[v-cloak] {
  display: none;
}
</style>
