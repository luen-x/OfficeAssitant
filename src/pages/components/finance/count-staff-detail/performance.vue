<template>
	<div class="v-finance-count-achi-performance g-flex g-fw-n g-flex-cc g-flex-ac">
		<div class="_item">
			<div class="__title">
				PK业绩（元）
				<oa-explain
					title="客户实际支付的金额，不用减手续费和退款，需要考虑分单情况"
					content="例：当月客户打款10万，分单出去5万，则PK业绩为5万"
				/>
			</div>
			<div class="__count">{{ info.pk_performance }}</div>
		</div>
		<div class="_item">
			<div class="__title">实际业绩（元）</div>
			<div class="__count">{{ info.real_performance }}</div>
		</div>
		<div class="_item">
			<div class="__title">
				提成业绩（元）
				<oa-explain
					title="当月可以算提成的业绩"
					content="如：销售下单的所有产品的实付金额为11万，产品的总共成本是1万，则当月的提成业绩是10万"
				/>
			</div>
			<div class="__count">{{ info.minus_performance }}</div>
		</div>
		<div class="_item">
			<div class="__title">退款金额（元）</div>
			<div class="__count">{{ info.refund_amount }}</div>
		</div>

		<div class="_item">
			<div class="__title">
				总提成（元）
				<oa-explain
					title="当月提成业绩乘以提成点所得"
					content="例：员工A的当月提成业绩为10万，A的固定提成点为10%，员工A当月的总提成为1万"
				/>
			</div>
			<div class="__count">{{ info.total_commission }}</div>
		</div>
		<div class="_item">
			<div class="__title">
				实发提成（元）
				<oa-explain
					title="当月实际发放给员工的提成，实发提成=总提成-服务提成+达标服务提成-扣回提成"
					content="如员工A的总提成为1万，服务提成为400，当月达标的服务提成为0，应扣回提成为5000，则员工A当月的实发提成为4600"
				/>
			</div>
			<div class="__count">{{ info.grant_commission }}</div>
		</div>
		<div class="_item">
			<div class="__title">服务提成（元）</div>
			<div class="__count">{{ info.service_commission }}</div>
		</div>
		<div class="_item">
			<div class="__title">达标服务提成（元）</div>
			<div class="__count">{{ info.grant_service_commission }}</div>
		</div>
	</div>
</template>

<script>
import { Row, Col } from "iview";
import API_ROOT from "@stores/apis/root";
import Explain from "@components/_common/explain/explain";

export default {
	name: "v-finance-count-staff-detail",
	components: {
		"i-row": Row,
		"i-col": Col,
		"oa-explain": Explain
	},

	data() {
		return {
			info: {
				performance_id: "",
				staff_id: "",
				depart_id: "",
				month: "",
				pk_performance: "0.00", // pk
				received_performance: "0.00", // 到账
				refund_amount: "0.00", // 退款
				real_performance: "0.00", // 实际
				minus_performance: "0.00", // 提成业绩
				total_commission: "0.00", // 总提成
				service_commission: "0.00", // 服务提成
				grant_commission: "0.00", // 实发提成
				grant_service_commission: "0.00" // 达标服务提成
			}
		};
	},

	mounted() {
		this.loadStaffInfo();
	},

	methods: {
		loadStaffInfo() {
			const { query = {} } = this.$route;
			this.$request({
				url: API_ROOT._FINANCE_COUNT_STAFF_DETAIL_GET,
				type: "GET",
				param: {
					month: query.month || "",
					staff_id: query.staff_id
				}
			}).then(res => {
				this.info = res.data;
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		}
	}
};
</script>

<style lang="scss">
.v-finance-count-achi-performance {
	height: 130px;
	background-color: #f5f5f6;
	margin: 20px 0px;
	flex-wrap: wrap;
	._item {
		margin-top: 10px;
		padding: 20px 0px;
		width: calc(100% / 8);
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
		height: 90px;
		border-left: 1px solid #d4d7db;
	}
}
</style>
