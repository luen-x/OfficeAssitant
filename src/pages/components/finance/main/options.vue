<template>
	<div class="v-finance-main-options">
		<div>
			<oa-title class="_title" title="待审核"/>
			<div class="_options g-pd-tb-30">
				<div class="__item" @click="handleGo('customer/achi')">
					<p>到账审核</p>
					<span>{{ wait.payment_await }}</span>
				</div>
				<div class="__item" @click="handleGo('customer/contract')">
					<p>客户合同</p>
					<span>{{ wait.contract_await }}</span>
				</div>
				<div class="__item" @click="handleGo('customer/refund')">
					<p>退款申请</p>
					<span>{{ wait.refund_await }}</span>
				</div>
				<div class="__item" @click="handleGo('customer/elec')">
					<p>电子合同</p>
					<span>{{ wait.electronic_contract_await }}</span>
				</div>
				<div class="__item" @click="handleGo('ballot')">
					<p>开票审核</p>
					<span>{{ wait.invoice_await }}</span>
				</div>
			</div>
		</div>
		<div class="v-finance-main-options">
			<div>
				<div class="g-flex g-m-t-30 ">
					<oa-title class="_title" title=" 录账下单数据"/>
					<span class="g-operation g-m-l-20 _more" @click="handleMore">查看更多</span>
				</div>
				<div class="_options g-pd-tb-30">
					<div class="__items" >
						<p>录账业绩</p>
						<span>{{ payment.pay_amount }}</span>
					</div>
					<div class="__items" >
						<p>已退金额</p>
						<span>{{ payment.refund_amount }}</span>
					</div>
					<div class="__items">
						<p>下单金额</p>
						<span>{{ payment.consume_amount }}</span>
					</div>
					<div class="__items">
						<p>未下单金额</p>
						<span>{{ payment.rest_amount }}</span>
					</div>
				</div>
			</div>
			<div class="g-m-t-30">
				<oa-title class="_title" title="走势图"/>
				<div class>
					<oa-echarts/>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import API_ROOT from "@stores/apis/root";
import Title from "./title";
import Echarts from "./echarts";

export default {
	name: "finance-main-options",
	components: {
		"oa-title": Title,
		"oa-echarts": Echarts
	},
	props: {
		wait: {
			type: Object,
			require: true,
			default() {
				return {};
			}
		},
		payment: {
			type: Object,
			require: true,
			default() {
				return {};
			}
		},
	},
	data() {
		return {};
	},
	methods: {
		handleGo(url) {
			this.$router.push(`/finance/${url}`);
		},
		handleMore() {
			this.$router.push(`/finance/main/playment/more`);
		},
		
	}
};
</script>

<style lang="scss">
.v-finance-main-options {
    font-size: 12px;
    color: #818794;
	._more {
		height: 22px;
		line-height: 22px;
	}
    ._title {
        margin-bottom: 28px;
    }
    ._options {
        box-shadow: 0px 0px 10px #6666664f;
        display: flex;
        .__item {
            width: 25%;
            box-sizing: border-box;
            text-align: center;
            border-right: 1px solid #e7e7e7;
            font-size: 18px;
            color: #333;
            cursor: pointer;
            p {
                font-size: 12px;
                margin-bottom: 5px;
            }
			&:hover {
				color: #2397f9;
			}
        }
        .__item:last-child {
            border-right: none;
        }
		.__items {
            width: 25%;
            box-sizing: border-box;
            text-align: center;
            border-right: 1px solid #e7e7e7;
            font-size: 18px;
            color: #333;
            p {
                font-size: 12px;
                margin-bottom: 5px;
            }
        }
        .__items:last-child {
            border-right: none;
        }
    }
}
</style>


