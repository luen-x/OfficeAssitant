<template>
	<div class="v-sale-customer-detail-relate-customer g-relative g-pd-t-20" style="min-height:260px;">
		<oa-loading v-if="loading"/>
		<div class="g-form-title g-c-black3" style="font-size: 14px;line-height: 14px;">号码关联客户</div>
		<div v-if="telRelateCompanys.length==0" class="g-c-black4 g-m-l-20 g-m-t-20">
			暂无号码关联客户
		</div>
		<div class="g-flex g-fw-w g-m-t-20" style="margin-right: -20px;">
			<oa-relate-company 
				v-for="item in telRelateCompanys"
				:key="item.customer_id"
				:data="item"
				:coin-config="coinConfig"
				:relate-type="1"
				:is-own="isOwn"
				:read-only="readOnly"
				@change="handleCustomerChange"
			/> 
		</div>
		<div class="g-form-title g-c-black3 g-m-t-20" style="font-size: 14px;line-height: 14px;">名称类似公司</div>
		<div v-if="nameRelateCompanys.length==0" class="g-c-black4 g-m-l-20 g-m-t-20">
			暂无名称类似公司
		</div>
		<div class="g-flex g-fw-w g-m-t-20 " style="margin-right: -20px;">
			<oa-relate-company 
				v-for="item in nameRelateCompanys"
				:key="item.customer_id"
				:data="item"
				:coin-config="coinConfig"
				:relate-type="2"
				:is-own="isOwn"
				:read-only="readOnly"
				@change="handleCustomerChange"
			/> 
		</div>
		
	</div>
</template>
<script>
import { services } from '@stores/services/sale';
import RelateCompany from '../../components/relate-company';

export default {
	name: 'oa-sale-customer-detail-relate-customer',
	components: {
		'oa-relate-company': RelateCompany
	
	},
	mixins: [
		services.coinConfig()
	],
	props: {
		customerId: Number,
		isOwn: Boolean,
		readOnly: Boolean

	},
	data() {
		return {
			loading: false,
			telRelateCompanys: [],
			nameRelateCompanys: []

		};
	},
	watch: {
		customerId(newVal, oldVal) {
			this.loadData();
		}
	},
	
	created() {
		this.loadData();

	},
	methods: {
		loadData() {
			this.loading = true;
			Promise.all([
				this.$request({
					url: "_SALE_CUSTOMER_INTENTION_RELATE_BY_TEL_GET",
					type: "GET",
					param: {
						customer_id: this.customerId
					},
					loading: false,
				}).then(res => {
					this.telRelateCompanys = res.data;
				}).catch((res) => {
					this.$Message.error(res.msg);
				}),
				this.$request({
					url: "_SALE_CUSTOMER_INTENTION_RELATE_BY_NAME_GET",
					type: "GET",
					param: {
						customer_id: this.customerId
					},
					loading: false,
				}).then(res => {
					this.nameRelateCompanys = res.data;

				}).catch((res) => {
					this.$Message.error(res.msg);
				})
			]).finally(res => {
				this.loading = false;
			});
			

			
		},
		handleCustomerChange() {
			this.loadData();
		}
	}
};
</script>
<style lang="scss">
</style>