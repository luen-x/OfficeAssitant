<template>
	<div>
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
		<i-tabs
			:value="type"
			:animated="false"
			type="card"
			style="margin-top: 40px"
			@on-click="handleChange"
		>
			<i-tab-pane
				v-for="(item) in tabs"
				:key="item.value"
				:label="item.label"
				:name="item.value"
			>
				<vc-paging
					:columns="getColumns"
					:show="item.value == type"
					:type="item.value"
					:data-source="listInfo[item.value].data"
					:total="listInfo[item.value].total"
					:reset="listInfo[item.value].reset"
					:current.sync="current[item.value]"
					:history="true"
					:load-data="loadData"
					:table-opts="{height: tableHeight}"
					class="v-finance-count-staff-detail-list"
					mode="table"
					@page-size-change="handleChangePageSize"
				/>
			</i-tab-pane>
			<i-tab-pane
				:label="'提成明细'"
				:name="'5'"
			>
				<oa-commission />
			</i-tab-pane>
			<div slot="extra" >
				<vc-debounce-click
					v-if="type==1"
					class="g-red-btn-line _btn-finance-staff-detail"
					@click="handleStatusModal"
				>
					PK业绩记录
				</vc-debounce-click>
				<vc-debounce-click
					v-if="type==2"
					class="g-red-btn-line _btn-finance-staff-detail"
					@click="handleEditModal"
				>
					修改业绩
				</vc-debounce-click>
				<vc-debounce-click
					v-if="type==2"
					class="g-red-btn-line _btn-finance-staff-detail"
					@click="handlePerformanceStatusModal"
				>
					修改记录
				</vc-debounce-click>
			</div>
		</i-tabs>
	</div>

</template>

<script>
import { Tabs, TabPane, Button } from "iview";
import { Paging } from "wya-vc";
import { getParseUrl, getHashUrl } from "@utils/utils";
import API_ROOT from "@stores/apis/root";
import { tableHeight } from "@extends/mixins/table";
// item
import Explain from "@components/_common/explain/explain";
import Commission from "@components/sale/achievement-staff/_common/achievement/commission";
import { PKRecord } from '@components/sale/achievement-staff/popup/pk-record';
import item from "./item";
import { EditModal } from "./popup/edit-minus";
import { PerformanceStatusModal } from "./popup/performance-status-modal";

export default {
	name: "oa-table",
	components: {
		"vc-paging": Paging,
		"i-tabs": Tabs,
		"i-tab-pane": TabPane,
		"i-button": Button,
		"oa-explain": Explain,
		"oa-commission": Commission,
	},
	mixins: [
		item,
		tableHeight({
			tabs: true,
			footer: true,
			extraEle: ["v-finance-count-achi-performance"],
			extraHeight: 70
		})
	],
	data() {
		const { query } = this.$route;
		return {
			type: String(query.type || "1"), // 同tabs下的value
			current: {},
			showPaging: true,
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
			},
			tabs: [
				{ label: "到账记录", value: "1" },
				{ label: "下单记录", value: "2" },
				{ label: "补款记录", value: "3" },
				{ label: "退款记录", value: "4" }
			]
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.financeCountStaffDetail.listInfo;
		}
	},
	mounted() {
		this.loadStaffInfo();
		this.$store.commit("FINANCE_COUNT_STAFF_DETAIL_ALL_LIST_INIT");
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
			})
				.then(res => {
					this.info = res.data;
				})
				.catch(err => {
					this.$Message.error(err.msg);
				});
		},
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: "FINANCE_COUNT_STAFF_DETAIL_ALL_LIST_GET",
				type: "GET",
				param: {
					...query,
					type: this.type,
					page,
					pageSize
				}
			})
				.then(res => {
				})
				.catch(error => {
					this.$Message.error(error.msg);
				});
		},
		handleChange(type) {
			this.type = type;
			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			query = {
				...query,
				type,
				page: this.current[type]
			};
			if (this.$route.path.match('/collage/salary/month')) {
				this.$router.replace(
					getHashUrl("/collage/salary/month", { ...query })
				);
			} else {
				this.$router.replace(
					getHashUrl("/finance/count/staff/detail", { ...query })
				);
			}
		},
		handleChangePageSize() {
			this.$store.commit("FINANCE_COUNT_STAFF_DETAIL_ALL_LIST_INIT");
		},
		handleEditModal() {
			let { query = {} } = getParseUrl();
			EditModal.popup({
				staff_id: query.staff_id,
				minus_performance: this.info.minus_performance
			}).then(res => {
				this.$store.commit("FINANCE_COUNT_STAFF_DETAIL_ALL_LIST_INIT");
			});
		},
		handlePerformanceStatusModal() {
			let { query = {} } = getParseUrl();
			PerformanceStatusModal.popup({
				scenario: 11,  
				staff_id: query.staff_id,
				month: query.month
			}).then(res => {});
		},
		handleStatusModal() {
			let { query = {} } = getParseUrl();
			PKRecord.popup({
				data: {
					staff_id: this.$route.query.staff_id ? this.$route.query.staff_id : '',
					month: this.$route.query.month || '',
					change_type: '2'
				}
			}).then(() => {});
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
._btn-finance-staff-detail {
  height: 26px;
  line-height: 26px;
}
</style>
