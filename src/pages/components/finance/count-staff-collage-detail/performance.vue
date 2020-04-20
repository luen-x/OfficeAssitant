<template>
	<div class="v-finance-count-achi-performance ">
		<div class="_item">
			<div class="__title">
				促单业绩（元）
			</div>
			<div class="__count">{{ info.minus_performance }}</div>
		</div>
		<div class="_item">
			<div class="__title">实际业绩（元）</div>
			<div class="__count">{{ info.real_performance }}</div>
		</div>
		<div class="_item">
			<div class="__title">
				促单提成（元）
			</div>
			<div class="__count">{{ info.total_commission }}</div>
		</div>
		<div
			v-if="is_charge!='0'&&type=='3'"
			class="_item"
		>
			<div class="__title">
				团队业绩（元）
			</div>
			<div class="__count">{{ info.team_performance }}</div>
		</div>
		<div
			v-if="is_charge!='0'&&type=='3'"
			class="_item"
		>
			<div class="__title">
				团队提成（元）
			</div>
			<div class="__count">{{ info.team_commission }}</div>
		</div>
		<div class="_item">
			<div class="__title">
				课时费（元）
			</div>
			<div class="__count">{{ info.lecture_fee }}</div>
		</div>
		<div class="_item">
			<div class="__title">
				补贴（元）
			</div>
			<div class="__count">{{ info.total_allowance }}</div>
		</div>
		<div class="_item">
			<div class="__title">退款金额（元）</div>
			<div class="__count">{{ info.refund_amount }}</div>
		</div>
		<div class="_item">
			<div class="__title">应扣回提成（元）</div>
			<div class="__count">{{ info.deduction_commission }}</div>
		</div>
		<div class="_item">
			<div class="__title">薪资总额（元）</div>
			<div class="__count">{{ info.gross_salary }}</div>
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
		const { query = {} } = this.$route;
		return {
			pathName: window.location.pathname,
			is_charge: query.is_charge,
			type: query.type || '1',
			info: {
				performance_id: "",
				staff_id: "",
				depart_id: "",
				month: "",
				minus_performance: "0", // 促单业绩
				total_allowance: "0", // 促单总提成
				team_performance: "0", // 团队业绩
				team_commission: "0", // 团队总提成
				real_performance: "0", // 实际业绩
				refund_amount: "0", // 退款金额
				deduction_commission: "0", // 应扣回提成
				lecture_fee: "0", // 课时费
				gross_salary: "0", // 薪资总额
				total_commission: "0",
			}
		};
	},
	watch: {
		$route(to, from) {
			if (to.query.type != from.query.type) {
				this.type = to.query.type;
			}
		}
	},

	mounted() {
		this.loadStaffInfo();
	},
	methods: {
		loadStaffInfo() {
			const { query = {} } = this.$route;
			this.$request({
				url: API_ROOT._FINANCE_COUNT_STAFF_COLLAGE_DETAIL_GET,
				type: "GET",
				param: {
					month: query.month || "",
					staff_id: query.staff_id
				}
			})
				.then(res => {
					this.info = res.data;
				})
				.catch(err => {
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
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  ._item {
	margin-top: 10px;
	padding: 20px 0px;
	display: flex;
	justify-content: center;
	flex-direction: column;
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
