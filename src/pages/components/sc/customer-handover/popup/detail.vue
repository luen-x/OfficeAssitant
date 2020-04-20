<template>
	<i-drawer
		v-model="closable"
		:mask="false"
		:mask-closable="false"
		class="v-sc-cooperate-handover-detial g-drawer-tabs"
		@on-close="handleCancel"
	>
		<oa-head :company_information="company_information"/>

		<i-tabs
			v-if="detailShow"
			:value="tabs"
			@on-click="handleSwitchTabs"
		>
			<i-tab-pane label="交接完成表" name="deliveryTable">
				<keep-alive>
					<oa-delivery-table
						v-show="tabs === 'deliveryTable'"
						ref="delivery"
						:project_delivery_id="project_delivery_id"
						:project_id="project_id"
					/>
				</keep-alive>
			</i-tab-pane>
			<i-tab-pane label="项目需求" name="projectRequirement">
				<keep-alive>
					<oa-project-requirement
						v-if="tabs === 'projectRequirement'"
						ref="project"
						:type="type"
						:project_id="project_id"
						:contract_id="contract_id"
						name="handover"
					/>
				</keep-alive>
			</i-tab-pane>
			<i-tab-pane label="客户信息" name="customerInformation">
				<keep-alive>
					<oa-customer-information
						v-if="tabs === 'customerInformation'"
						:contract_id="contract_id"
						:project_id="project_id"
					/>
				</keep-alive>
			</i-tab-pane>
		</i-tabs>

		<div v-if="showFooter" class="_footer">
			<i-button
				v-if="type == 1 && $auth[1285]"
				style="margin-right: 8px"
				type="primary"
				@click="handleOpenAudit('1')"
			>
				审核通过
			</i-button>

			<i-button
				v-if="type == 1 && $auth[1286]"
				style="margin-right: 8px"
				@click="handleOpenAudit('2')"
			>
				审核驳回
			</i-button>

			<i-button
				v-if="$auth[1287]"
				@click="handleUploadDeliveryForm"
			>
				更改交接表
			</i-button>
		</div>
	</i-drawer>
</template>

<script>
import { Drawer, Row, Col, Button, Tabs, TabPane, Spin } from "iview";
import { CreatePortal } from "wya-vc";
import { DetailItem, Title } from "@components/sc/_common";
import API_ROOT from "@stores/apis/root";
import { AuditModal } from "./audit";
import { UploadDeliveryFormModal } from "../../_common/detail/upload-delivery-form/upload-delivery-form";
import CustomerInformation from "../../_common/detail/customer/customer-information";
import ProjectRequirement from "../../_common/detail/project-requirement/project-requirement";
import DeliveryTable from "./delivery-table";
import Head from "../../_common/detail/head/head";

export default {
	name: "sc-handover-detail-drawer",

	components: {
		"i-drawer": Drawer,
		"oa-title": Title,
		"i-button": Button,
		"oa-detail-item": DetailItem,
		"i-tabs": Tabs,
		"i-tab-pane": TabPane,
		"i-spin": Spin,
		"oa-customer-information": CustomerInformation,
		"oa-project-requirement": ProjectRequirement,
		"oa-delivery-table": DeliveryTable,
		"oa-head": Head
	},

	props: {
		type: String,
		contract_id: Number,
		project_id: Number,
		project_delivery_id: Number
	},

	data() {
		return {
			closable: false,
			tabs: "deliveryTable",
			show: false,
			company_information: {},
			detailShow: true,
		};
	},

	computed: {
		showFooter() {
			if (!this.$auth[1285] && !this.$auth[1286] && !this.$auth[1287]) {
				return false;
			} else {
				return true;
			}
		}
	},

	mounted() {
		this.loadData();
		this.closable = true;
	},
	
	methods: {
		loadData() {
			this.detailShow = false;

			this.$nextTick(() => {
				this.detailShow = true;
				this.tabs = "deliveryTable";
			});

			this.loadHeadData();
		},

		loadHeadData() {
			this.$request({
				url: API_ROOT._SALE_CONTRACT_DETAIL_GET,
				type: "GET",
				param: {
					contract_id: this.contract_id,
					project_id: this.project_id
				},
				loading: false
			}).then(res => {
				this.company_information = res.data;
			}).catch(error => {});
		},

		handleOk() {
			this.$emit("sure");
		},

		handleCancel() {
			this.$emit("close");
		},

		handleClose() {
			this.flag_project = !this.flag_project;
		},

		// 通过驳回
		handleOpenAudit(name) {
			AuditModal.popup({
				name,
				project_id: this.project_id,
				project_delivery_id: this.project_delivery_id
			}).then(res => {
				res && this.handleCancel();
			});
		},

		// 切换标签页
		handleSwitchTabs(name) {
			this.tabs = name;
		},

		handleRresh(v) {
			v && this.$store.commit('SC_CUSTOMER_COOPERATE_LIST_RESET', {
				type: this.type
			});
		},

		// 上传交付表
		handleUploadDeliveryForm() {
			UploadDeliveryFormModal.popup({
				contract_id: this.contract_id,
				project_id: this.project_id,
				name: 1,
				delivery_data: this.$refs.delivery.delivery_data,
				flag: 1
			}).then(res => {
				res && this.$refs.delivery.loadData();
			});
		}
	}
};

export const DetailDrawer = CreatePortal({
	alive: true
}, module.exports.default);
</script>

<style lang="scss">
.v-sc-cooperate-handover-detial{
	.ivu-tabs{
		height: calc(100% - 190px);

		.ivu-tabs-tabpane{
			overflow-x: hidden;
			overflow-y: auto;
			max-height: 100%;
		}

		.ivu-tabs-content{
			height: calc(100% - 34px);
		}
	}

	.ivu-drawer-body {
		padding: 0px;
		overflow-y: hidden;

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

	._footer {
		width: 940px;
		position: fixed;
		bottom: 0;
		right: 0;
		border-top: 1px solid #e8e8e8;
		padding: 13.5px 16px;
		text-align: left;
		background: #fff;
		box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.1);
	}
}
</style>