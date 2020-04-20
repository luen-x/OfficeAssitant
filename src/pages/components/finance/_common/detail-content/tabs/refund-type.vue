<template>
	<oa-refund-info :refund-id="refundId" :refund-type="refundType" :status="type" class="v-sale-tabcontent-large g-m-b-20"/>
</template>
<script>
import SaleRefundInfo from '@components/sale/_common/customer/popup/refund-detail/parts/refund-info';

export default {
	name: 'oa-sale-refund-info',
	components: {
		
		'oa-refund-info': SaleRefundInfo
	},
	props: {
		label: String,
		refundId: Number,
		show: Boolean,
		type: String,
		refundType: Number
	},
	data() {
		return {
		};
	},
	methods: {
	}
};
</script>
<style lang="scss">
</style>