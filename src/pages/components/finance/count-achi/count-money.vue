<template>
	<i-row class="v-finance-count-achi g-flex g-flex-cc g-flex-ac">
		<i-col span="6" class="_item">
			<div class="__title">
				实付业绩（元）
				<oa-explain
					title="客户实际支付的金额，不用减手续费和退款"
					content="例：当月客户打款10万，则实付业绩为10万"
				/>
			</div>
			<div class="__count">{{ formValidate.pay_performance||"0.00" }}</div>
		</i-col>
		<i-col span="6" class="_item">
			<div class="__title">
				到账业绩（元）
				<oa-explain
					title="客户打款到账金额扣除手续费后的业绩"
					content="例：当月客户信用卡转账10万，手续费1千，则到账业绩为9万9千"
				/>
			</div>
			<div class="__count">{{ formValidate.received_performance||"0.00" }}</div>
		</i-col>
		<i-col span="6" class="_item">
			<div class="__title">退款金额（元）</div>
			<div class="__count">{{ formValidate.refund_amount||"0.00" }}</div>
		</i-col>
		<i-col span="6" class="_item">
			<div class="__title">
				实收业绩（元）
				<oa-explain
					:width="160"
					title="客户实际支付的金额减去手续费和客户退款金额"
					content="例：当月客户信用卡转账10万，手续费1千，之后退款了5万，则实收业绩为4万9千"
				/>
			</div>
			<div class="__count">{{ formValidate.real_performance||"0.00" }}</div>
		</i-col>
	</i-row>
</template>

<script>
import { Row, Col } from "iview";
import API_ROOT from "@stores/apis/root";
import Explain from '@components/_common/explain/explain';

export default {
	name: "v-finance-count-achi",
	components: {
		"i-row": Row,
		"i-col": Col,
		'oa-explain': Explain
	},
	props: {
		depart_id: Array,
		month: String
	},

	data() {
		return {
			formValidate: {
				pay_performance: "", // 实付
				received_performance: "", // 到账
				refund_amount: "", // 退款
				real_performance: "" // 实际
			}
		};
	},
	watch: {
		month(curVal, oldVal) {
			if (curVal !== oldVal) {
				this.fetchJobInfo();
			}
		},
		depart_id(curVal, oldVal) {
			if (curVal !== oldVal) {
				this.fetchJobInfo();
			}
		}
	},
	mounted() {
		this.fetchJobInfo();
	},

	methods: {
		fetchJobInfo() {
			this.$request({
				url: API_ROOT._FINANCE_COUNT_ACHI_COUNT_POST,
				type: "POST",
				param: {
					month: this.month,
					depart_id: this.depart_id
				}
			}).then(res => {
				this.formValidate = res.data[0] || {};
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		}
	}
};
</script>

<style lang="scss">
.v-finance-count-achi {
    background-color: #f5f5f6;
    height: 130px;
    margin: 20px 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    ._item {
        height: 80%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .__title {
            color: #818794;
            font-size: 14px;
        }
        .__count {
            color: #333;
            font-size: 24px;
        }
    }
    ._item + ._item {
        border-left: 1px solid #d4d7db;
    }
}
</style>
