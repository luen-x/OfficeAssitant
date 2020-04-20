<template>
	<div>
		<h2 class="g-c-black1 g-fs-16" style="padding-left: 73px;">
			{{ balances.contract_company_name }}
			<!-- 暂时隐藏提示 -->
			<i-poptip 
				v-if="0"
				ref="know"
				width="300" 
				class="_konw-tip" 
				placement="bottom-end"
				popper-class="v-sale-customer-deal-contract-order-poptip"
				transfer
				word-wrap
			>
				<span class="g-pointer" >下单须知</span>
				<div slot="content">
					<!-- eslint-disable -->
							<div >①下单前提：下单之前必须录入到账且被财务审核通过;

②应付金额：不优惠的情况下，应付金额等于产品的价格，如果优惠了，优惠在价格高的产品上（例如：客户购买了179800的软件+增值服务的套餐，优惠了9800，其他的增值服务类（价格低）产品，应付金额都填写产品的价格，微商全套填写142200-9800=132400；若购买了179800的内训套餐，优惠在“大课培训+咨询服务”这个产品上）；

③实付金额：如果客户没有分期付款，实付金额等于应付金额；如果客户分期付款，价格低的产品的实付金额填写的跟应付金额一致，分期分在价格高的产品上，这个产品的实付金额=可用余额-其他产品的实付金额之和或所有产品的应付金额之和-其他产品的实付金额之和（例如：客户购买了179800的套餐，没有优惠，第一次支付了100000元，朋友圈配套文案、品牌视觉和百度推广的实付金额分别填写：5000、12800和19800，微商全套的实付金额=100000-5000-12800-19800=62400元）；

④实扣成本：这个只针对商学院产品，若客户分期付款，这里的实扣成本就填写本次分给商学院的业绩，如果客户一次性付款，实扣成本填写的跟产品成本一样就可以。
							</div>
							<!-- eslint-enable -->
					<div 
						class="g-tc g-pointer g-m-t-10"
						style="height:30px;font-size:13px" 
						@click="handleCloseKnow"
					>
						<span class="__know-btn">知道了</span>
					</div>
				</div>
			</i-poptip>
		</h2>
		<div style="padding-left:74px" class="g-m-t-10 g-fs-14">可用余额: <span class="g-c-red-mid">￥{{ balances.total_balance_amount }}</span></div>
	</div>
</template>
<script>
import { Input, Button, Poptip } from 'iview';

export default {
	name: 'oa-',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-poptip': Poptip
	},
	props: {
		contractCompanyId: [Number, String],
		contractId: [Number, String]
	},
	data() {
		return {
			balances: {
				total_balance_amount: '',
				contract_company_name: '',
				contract_company_id: ''
			}
		};
	},
	created() {
		this.loadCustomerBalances();
	},
	methods: {
		loadCustomerBalances() {
			this.$request({
				url: "_SALE_CONTRACT_CUSTOMER_BALANCE_GET",
				type: "GET",
				param: {
					contract_company_id: this.contractCompanyId,
					contract_id: this.contractId,
				 },
				loading: false,
			}).then(res => {
				this.balances = res.data;
				this.$emit('balance-change', this.balances.total_balance_amount);
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},
		handleCloseKnow() {
			this.$refs.know.handleClose();
		}
	}
};
</script>
<style lang="scss">
.v-sale-customer-deal-contract-order-poptip{
	.ivu-poptip-inner {
			background: inherit;
			.ivu-poptip-body{
				background:rgba(0, 0, 0, 0.6);
				border-radius: 4px;
				color: #fff;
				.__know-btn {
					border: 1px solid white;
					background: #dbd9d94f;
					border-radius: 4px;
					padding: 6px 10px;
				}
			}
	}
	.ivu-poptip-arrow:after{
			border-bottom-color: rgb(102, 102, 102) !important;
			border-top-color: rgb(102, 102, 102) !important;
	}	
}
</style>