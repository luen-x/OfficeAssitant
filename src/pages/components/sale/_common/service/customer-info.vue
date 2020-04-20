<template>
	<div class="g-pd-r-20">
		<div class="v-sale-customer-info">
			<div class="_detail-content">
				<div class="g-fs-14" style="margin: 25px 0 15px 0;">
					<span class="__title-bar"/>
					<span class="g-pd-l-5">基本信息</span>
				</div>
				<div class="_content g-flex g-jc-sb">
					<div class="__left g-m-l-15">
						<div class="__txt g-flex">
							<div class="g-c-black4 __label">客户姓名</div>
							<div class="__info">{{ customerInfo.customer_name || '--' }}</div>
						</div>
						<div class="__txt g-flex">
							<div class="g-c-black4 __label">行业</div>
							<div class="__info">{{ customerInfo.industry_name || '--' }}</div>
						</div>
						<div class="__txt g-flex">
							<div class="g-c-black4 __label">地区</div>
							<div class="__info">{{ customerInfo.address || '--' }}</div>
						</div>
					</div>
					<div class="__right">
						<div class="__txt g-flex">
							<div class="g-c-black4 __label">客户电话</div>
							<div class="__info">{{ customerInfo.customer_mobile || '--' }}</div>
						</div>
						<div class="__txt g-flex">
							<div class="g-c-black4 __label">公司规模</div>
							<div class="__info">{{ customerInfo.scale_name || '--' }}</div>
						</div>
					</div>
				</div>
				<div 
					v-if="contractList.length" 
					class="g-m-tb-30 g-fs-14"
				>
					<span class="__title-bar"/>
					<span class="g-pd-l-5">合同信息</span>
				</div>
				<div class="_content">
					<div 
						v-for="(item, index) in contractList" 
						:key="index"
						class="g-pd-tb-10 g-m-b-20 __contract"
					>
						<div 
							class="g-flex g-jc-sb g-pd-l-10 g-pd-r-20 g-pd-b-10"
						>
							<div class="g-flex __info g-fs-14">
								<div>
									<span>合同编号：</span>
									<span>{{ item.contract_num }}</span>
								</div>
								<span class="g-m-lr-10">|</span>
								<div>
									<span>下单日期：</span>
									<span>{{ item.create_time }}</span>
								</div>
								<span class="g-m-lr-10">|</span>
								<div>
									<span>服务提成：</span>
									<span class="g-c-red-mid">{{ item.send_commission }}</span>
									<span>/{{ item.service_commission }}</span>
								</div>
							</div>
							<span 
								v-if="item.label_type" 
								class="__lose g-pd-lr-15 g-pd-tb-5 g-c-black4"
							>
								已失效
							</span>
						</div>
						<div class="g-pd-l-10 g-pd-r-20 g-c-black4">
							<div class="g-pd-b-10">
								<span>下单产品：</span>
								<span>{{ item.products }}</span>
							</div>
							<div class="g-flex">
								<div>
									<span>合同金额：</span>
									<span>{{ item.contract_amount }}</span>
								</div>
								<span class="g-m-lr-10">|</span>
								<div>
									<span>应付金额：</span>
									<span>{{ item.need_amount }}</span>
								</div>
								<span class="g-m-lr-10">|</span>
								<div>
									<span>实付金额：</span>
									<span>{{ item.payment_amount }}</span>
								</div>
								<span class="g-m-lr-10">|</span>
								<div>
									<span>服务期限：</span>
									<span>{{ item.cooperate_year }}年</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "oa-customer-info",
	props: {
		customerInfo: Object,
		contractList: Array
	},
	data() {
		return {};
	}
};

export const ServiceCustomerInfo = module.exports.default;
</script>

<style lang="scss">
.v-sale-customer-info {
    width: 100%;
	position: relative;
    .__left {
        width: 45%;
    }
    .__right {
        width: 45%;
    }
	._detail-content {
		padding: 0 20px;
		.__title-bar {
			display: inline-block;
			width: 2px;
			height: 14px;
			position: relative;
			top: 2px;
			background-color: #e84854;
		}
	}
    .__txt {
		padding: 12px 0;
		color: #333;
        border-bottom: 1px solid #e8eaec;
        .__label {
			width: 120px;
        }
    }
	.__info {
		width: 100%;
		color: #333;
		img {
			border: 1px solid #e8eaec;
		}
	}
    .__more {
        width: 100px;
    }
	.__contract {
		position: relative;
		border: 1px solid #e8e8e8;
		border-radius: 4px;
		&:hover {
			box-shadow: 0px 1px 8px 0px rgba(0, 0, 0, 0.1);
		}
	}
	.__lose {
		position: absolute;
		top: 0;
		right: 0;
		background-color: #f6f6f6;
	}
	.ivu-form-item {
		width: 100%;
		margin-bottom: 0;
		padding: 10px 0;
		border-bottom: 1px solid #e8eaec;
	}
    .ivu-form-item-content {
        margin-left: 0;
    }
    .ivu-form .ivu-form-item-label {
        width: 125px;
		text-align: left;
    }
    .ivu-form-item-content {
        width: 80%;
    }
}
</style>
