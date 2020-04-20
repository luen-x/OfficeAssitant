<template>
	<i-drawer
		v-model="closable"
		:mask="false"
		:mask-closable="false"
		class="v-hr-employee-score-service-examine-detail"
		@on-close="handleCancel"
	>
		<div class="g-pd-l-20 _header">
			<div class="g-m-t-30 g-c-black">
				<span class="g-fs-20">
					{{ customer_base_info.contract_company_name }}
				</span>
			</div>

			<ul class="g-flex g-flex-ac g-fw-w">
				<li class="g-m-t-20">
					<span>服务人：</span>
					<span class="g-c-black">
						{{ customer_base_info.service_person }}
					</span>
				</li>

				<li class="g-m-t-20">
					<span>服务人手机号：</span>
					<span class="g-c-black">
						{{ customer_base_info.service_person_phone }}
					</span>
				</li>

				<li class="g-m-t-20">
					<span>部门：</span>
					<span class="g-c-black">
						{{ customer_base_info.service_person_depart }}
					</span>
				</li>

				<li class="g-m-t-20">
					<span>客户姓名：</span>
					<span class="g-c-black">
						{{ customer_base_info.customer_name }}
					</span>
				</li>

				<li class="g-m-t-20">
					<span>注册资金：</span>
					<span class="g-c-black">
						{{ customer_base_info.capital ? customer_base_info.capital !== '-1.00' ? `${customer_base_info.capital}万元` : '--' : "--" }}
					</span>
				</li>

				<li class="g-m-t-20">
					<span>公司规模：</span>
					<span class="g-c-black">
						{{ customer_base_info.scale_name }}
					</span>
				</li>

				<li class="g-m-t-20">
					<span>公司地区：</span>
					<span class="g-c-black">
						{{ address }}
					</span>
				</li>
			</ul>

			<i-table
				:columns="columns"
				:data="tableData"
				class="g-m-t-20 g-m-r-20"
				border
				stripe
			/>
		</div>

		<div v-if="showDiv" style="height:37px"/>
		<i-tabs
			v-if="detailShow"
			:value="tabs"
			class="g-m-t-20 _tabs"
			@on-click="handleSwitchTabs"
		>
			<i-tab-pane label="待评服务" name="serviceFirst">
				<oa-service-validation
					v-if="tabs==='serviceFirst' && $auth[889]"
					key="1"
					ref="evalute"
					:within_system="within_system"
					:contract-length="tableData.length"
					:contract_company_id="contract_company_id"
					:type="1"
					name="evalute"
				/>
			</i-tab-pane>
			<i-tab-pane label="已评服务" name="serviceSecond">
				<keep-alive>
					<oa-service-validation
						v-if="tabs==='serviceSecond' && $auth[890]"
						key="2"
						:within_system="within_system"
						:contract-length="tableData.length"
						:contract_company_id="contract_company_id"
						:type="2"
						name="evaluted"
					/>
				</keep-alive>
			</i-tab-pane>
			<i-tab-pane label="回访记录" name="returnRcords">
				<keep-alive>
					<oa-return-record
						v-if="tabs === 'returnRcords'"
						:contract_company_id="contract_company_id"
						name="examine"
					/>
				</keep-alive>
			</i-tab-pane>
			<i-tab-pane label="服务提成" name="servicesCommission">
				<keep-alive>
					<oa-services-commission
						v-if="tabs === 'servicesCommission'"
						:contract-company-id="contract_company_id"
						:from-other="true"
						name="servicesCommission"
					/>
				</keep-alive>
			</i-tab-pane>
			<i-tab-pane label="客户投诉" name="complaint">
				<oa-complaint
					v-if="tabs==='complaint' && $auth[894]"
					:contract_company_id="contract_company_id"
					name="examine"
				/>
			</i-tab-pane>
		</i-tabs>
	</i-drawer>
</template>

<script>
import { Drawer, Row, Col, Tabs, TabPane, Table } from "iview";
import { CreatePortal } from "wya-vc";
import API_ROOT from "@stores/apis/root";
import ServiceValidation from "./service-validation";
import Complaint from "./complaint";
import ReturnRecords from "../../../sc/_common/service-manage-detail/return-records";
import ServicesCommission from '../../../sale/_common/service/royalty';

export default {
	name: "sc-customer-detail-drawer",

	components: {
		"i-drawer": Drawer,
		"i-tabs": Tabs,
		"i-tab-pane": TabPane,
		"i-table": Table,
		"oa-service-validation": ServiceValidation,
		"oa-complaint": Complaint,
		"oa-services-commission": ServicesCommission,
		"oa-return-record": ReturnRecords
	},

	props: {
		contract_company_id: Number,
		wait_confirm: Number,
		within_system: [Number, String]
	},

	data() {
		return {
			closable: false,
			show: false,
			showDiv: false,
			detailShow: false,
			tabs: "serviceFirst",
			customer_base_info: {},
			columns: [{
				title: " ",
				key: " ",
				minWidth: 80,
				render: (h, params) => {
					if (this.tableData.length === 1) {
						return (
							<div>合同:{params.row.contract_num}</div>
						);
					} else {
						return (
							<div>合同{params.index + 1}:{params.row.contract_num}</div>
						);
					}
				}
			}, {
				title: "第一阶段",
				key: "stage_one",
				minWidth: 120,
				tooltip: true,
				render: (h, params) => {
					return (
						<div class="g-flex">
							<div class="g-m-r-5">{params.row.stage_one.finish_num}/{params.row.stage_one.need_service_num}</div>
							<div>{params.row.stage_one.start_time}~{params.row.stage_one.end_time}</div>
						</div>
					);
				}
			}, {
				title: "第二阶段",
				key: "stage_two",
				minWidth: 120,
				tooltip: true,
				render: (h, params) => {
					if (params.row.stage_two.begin_info) {
						return (
							<div class="g-flex">
								<div class="g-m-r-5">未开始</div>
								<div>{params.row.stage_two.start_time}~{params.row.stage_two.end_time}</div>
							</div>
						);
					} else {
						return (
							<div class="g-flex">
								<div class="g-m-r-5">{params.row.stage_two.finish_num}/{params.row.stage_two.need_service_num}</div>
								<div>{params.row.stage_two.start_time}~{params.row.stage_two.end_time}</div>
							</div>
						);
					}
				}
			}, {
				title: "第三阶段",
				key: "stage_three",
				minWidth: 120,
				tooltip: true,
				render: (h, params) => {
					if (params.row.stage_three.finish_num) {
						return (
							<div class="g-flex">
								<div class="g-m-r-5">{params.row.stage_three.finish_num}/{params.row.stage_three.need_service_num}</div>
								<div>{params.row.stage_three.start_time}~{params.row.stage_three.end_time}</div>
							</div>
						);
					} else if (params.row.stage_three.begin_info) {
						return (
							<div class="g-flex">
								<div class="g-m-r-5">未开始</div>
								<div>{params.row.stage_three.start_time}~{params.row.stage_three.end_time}</div>
							</div>
						);
					} else {
						return (
							<div class="g-m-r-5">--</div>
						);
					}
				}
			}],
			tableData: [],
			address: ""
		};
	},

	mounted() {
		this.$nextTick(() => {
			document.querySelector(".ivu-drawer-body").addEventListener('scroll', this.handleScroll);
		});
		this.loadData();
		this.closable = true;
	},

	beforeDestroy() {
		// if (this.wait_confirm != ((this.$refs.evalute.confirmCount || 0) + (this.$refs.evalute.confirmedCount || 0))) {
		// 	this.$store.commit('HR_EMPLOYEE_SCORE_SERVICE_EXAMINE_LIST_RESET', {});
		// }
	},

	methods: {
		// 吸顶效果
		handleScroll() {
			let scrollTop = document.querySelector(".ivu-drawer-body").scrollTop;
			let height = document.querySelector("._header").offsetHeight;

			if (scrollTop - 50 >= height) {
				this.showDiv = true;
				document.querySelector("._tabs .ivu-tabs-bar").className = 'ivu-tabs-bar _scroll';
			} else {
				this.showDiv = false;
				document.querySelector("._tabs .ivu-tabs-bar").setAttribute('class', 'ivu-tabs-bar');
			}
		},
		loadData() {
			this.detailShow = false;

			// this.$nextTick(() => {
			// 	this.detailShow = true;
			// 	this.tabs = "serviceFirst";
			// });

			this.loadHeadData();
			this.loadTableData().then(() => {
				this.detailShow = true;
				this.tabs = "serviceFirst";
			});
		},

		handleCancel() {
			this.$emit("close");
		},

		// 切换标签页
		handleSwitchTabs(name) {
			this.tabs = name;
		},

		// 头部信息
		loadHeadData() {
			this.$request({
				url: API_ROOT._SC_MANAGE_INSPECTION_QUALITY_CUSTOMER_BASE_INFO_GET,
				type: "GET",
				param: {
					contract_company_id: this.contract_company_id
				},
				loading: false
			}).then(res => {
				this.customer_base_info = res.data;
				this.address = this.customer_base_info.province_name + " "
				+ this.customer_base_info.city_name + " " + this.customer_base_info.area_name;
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},

		// 头部表格信息
		loadTableData() {
			return this.$request({
				url: API_ROOT._HR_EMPLOYEE_SCORE_SERVICE_EXAMINE_SERVICE_INFO_GET,
				type: "GET",
				param: {
					contract_company_id: this.contract_company_id
				},
				loading: false
			}).then(res => {
				this.tableData = res.data;
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		}
	}
};

export const DetailDrawer = CreatePortal({
	alive: true
}, module.exports.default);
</script>

<style lang="scss">
.v-hr-employee-score-service-examine-detail {
	overflow-y: auto;

	._scroll {
		position: fixed;
		top: 55px;
		width: 100%;
		z-index: 100;
	}

    .ivu-drawer-body {
		padding: 0px;
		overflow-y: auto;

		.ivu-tabs-nav .ivu-tabs-tab-active {
			color: #e84854;
		}
		.ivu-tabs-tab:hover {
			color: #e84854;
		}
		.ivu-tabs-ink-bar {
			background: #e84854;
			bottom: 0;
		}
		.ivu-tabs-nav-scroll {
			background: #f5f5f6;
			border-bottom: 2px solid #d4d7db;
		}
		.ivu-tabs-ink-bar {
			width: 58px !important;
			left: 15px !important;
		}
		.ivu-tabs-bar{
			margin-bottom: 0px;
		}
	}

    ul{
        li{
            width: 25%;
            list-style: none;
        }
    }
}
</style>