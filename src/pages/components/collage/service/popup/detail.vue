<template>
	<i-drawer
		v-model="closable"
		:mask="false"
		:mask-closable="false"
		class="v-collage-service-detail"
		@on-close="handleCancel"
	>
		<oa-head :company_information="company_information"/>

		<i-tabs
			v-if="detailShow"
			:style="showFooter ? 'height: calc(100% - 180px);': 'height: calc(100% - 120px);'"
			v-model="tabs"
			@on-click="handleSwitchTabs"
		>
			<i-tab-pane label="项目需求" name="projectRequirement">
				<keep-alive>
					<oa-project-requirement
						v-if="tabs === 'projectRequirement'"
						ref="project"
						:type="type"
						:project_id="project_id"
						:contract_id="contract_id"
						name="service"
					/>
				</keep-alive>
			</i-tab-pane>
			<i-tab-pane label="客户信息" name="customerInformation">
				<keep-alive>
					<oa-customer-information
						v-if="tabs === 'customerInformation'"
						:contract_id="contract_id"
						:project_id="project_id"
						:contract_type="contract_type"
					/>
				</keep-alive>
			</i-tab-pane>
			<i-tab-pane label="补款记录" name="supplementRecord">
				<keep-alive>
					<oa-supplement-record
						v-if="tabs === 'supplementRecord'"
						:contract_id="contract_id"
						:project_id="project_id"
					/>
				</keep-alive>
			</i-tab-pane>
			<i-tab-pane label="服务分配" name="serviceDistribute">
				<keep-alive>
					<oa-service-distribute
						v-if="tabs === 'serviceDistribute'"
						ref="serviceDistribute"
						:type="type"
						:project-id="project_id"
						:product-name="product_name"
						:lesson-type="lesson_type"
						@loadBtn="handleLoadBtn"
					/>
				</keep-alive>
			</i-tab-pane>
			<i-tab-pane label="服务记录" name="serviceRecord">
				<keep-alive>
					<oa-service-record
						v-if="tabs === 'serviceRecord'"
						ref="serviceRecord"
						:type="type"
						:project-id="project_id"
						@reload="loadData"
					/>
				</keep-alive>
			</i-tab-pane>
			<i-tab-pane label="交付表" name="deliveryTable">
				<keep-alive>
					<oa-delivery-table
						v-if="tabs === 'deliveryTable'"
						:project_id="project_id"
						:lesson_type="lesson_type"
						:type="type"
						name="service"
					/>
				</keep-alive>
			</i-tab-pane>
			<i-tab-pane label="质检记录" name="qualityRecord">
				<keep-alive>
					<oa-quality-record
						v-if="tabs === 'qualityRecord'"
						:contract_company_id="contract_company_id"
						:type="type"
					/>
				</keep-alive>
			</i-tab-pane>
		</i-tabs>

		<div 
			v-if="showFooter && ($auth[1297] || $auth[1298]) && (authType !== 3 || authType === 1)" 
			class="_footer"
		>
			<i-button
				v-if="$auth[1297] && authType !== 3"
				style="margin-right: 8px;height: 32px;"
				type="primary"
				@click="handleDistribute"
			>
				分配
			</i-button>
			<i-button
				v-if="$auth[1298] && authType === 1"
				style="margin-right: 8px;height: 32px;"
				type="default"
				@click="handleTransfer"
			>
				转让
			</i-button>
		</div>
	</i-drawer>
</template>

<script>
import { Drawer, Row, Col, Button, Tabs, TabPane, Spin } from "iview";
import { CreatePortal } from "wya-vc";
import API_ROOT from "@stores/apis/root";
import Head from "../../_common/detail/head/head";
import CustomerInformation from "../../_common/detail/customer/customer-information";
import ProjectRequirement from "../../_common/detail/project-requirement/project-requirement";
import SupplementRecord from "../../_common/detail/supplement-record/supplement-record";
import DeliveryTable from "../../_common/detail/delivery-table/delivery-table";
import serviceDistribute from "../../_common/detail/service-distribute/service-distribute";
import serviceRecord from "../../_common/detail/service-record/service-record";
import qualityRecord from "../../_common/detail/quality-record/quality-record";
import { TransferCustomer } from '../../_common/detail/service-distribute/popup/transfer-customer';
import { DistributeNestEdit } from '../../_common/detail/service-distribute/popup/nest-edit';

export default {
	name: "collage-customer-detail-drawer",

	components: {
		"i-drawer": Drawer,
		"i-button": Button,
		"i-tabs": Tabs,
		"i-tab-pane": TabPane,
		"i-spin": Spin,
		"oa-customer-information": CustomerInformation,
		"oa-project-requirement": ProjectRequirement,
		"oa-supplement-record": SupplementRecord,
		"oa-head": Head,
		"oa-delivery-table": DeliveryTable,
		"oa-service-distribute": serviceDistribute,
		"oa-service-record": serviceRecord,
		"oa-quality-record": qualityRecord
	},

	props: {
		type: String,
		product_name: String,
		contract_id: Number,
		contract_company_id: Number,
		project_id: Number,
		lesson_type: Number, // 1 表示线上 2表示线下
		contract_type: Number
	},

	data() {
		return {
			closable: false,
			tabs: "",
			show: false,
			company_information: {},
			flag_project: false, // 修改成本页面变化的标识
			detailShow: true,
			authType: ''
		};
	},

	computed: {
		showFooter() {
			if (this.tabs === "serviceDistribute") {
				return true;
			}

			return false;
		}
	},

	mounted() {
		this.loadData();
		this.closable = true;
	},
	
	methods: {
		loadData(tab) {
			this.detailShow = false;

			this.$nextTick(() => {
				this.detailShow = true;
				this.tabs = tab === 'deliveryTable' ? tab : "projectRequirement";
			});

			this.$request({
				url: API_ROOT._SALE_CONTRACT_DETAIL_GET,
				type: "GET",
				param: {
					contract_id: this.contract_id
				},
				loading: false
			}).then(res => {
				this.company_information = res.data;
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},

		handleOk() {
			this.$emit("sure");
		},

		handleCancel() {
			this.$emit("close");
		},

		// 切换标签页
		handleSwitchTabs(name) {
			this.tabs = name;
		},
		handleDistribute() {
			if (this.lesson_type == 1) {
				DistributeNestEdit.popup({
					title: '分配套系',
					isEdit: false,
					lessonType: this.lesson_type,
					projectId: this.project_id
				}).then(res => {
					this.$refs.serviceDistribute.loadData();
					this.$vc.emit('COLLAGE_RELOAD_SERVICE_RECORD');
					this.$store.commit('COLLAGE_SERVICE_LIST_RESET', { type: this.type });
				}).catch(error => {});
			} else {
				this.$request({
					url: '_COLLAGE_BUSINESS_ADD_LESSON_POST',
					type: 'POST',
					loading: false,
					param: {
						project_id: this.project_id,
						lesson_type: this.lesson_type
					},
					autoTip: true
				}).then(res => {
					this.$refs.serviceDistribute.loadData();
					this.$vc.emit('COLLAGE_RELOAD_SERVICE_RECORD');
					this.$store.commit('COLLAGE_SERVICE_LIST_RESET', { type: this.type });
				}).catch(error => {});
			}
		},
		handleTransfer() {
			TransferCustomer.popup({
				projectId: this.project_id
			}).then(({ depart_id }) => {
				this.$request({
					url: '_COLLAGE_BUSINESS_PROJECT_ASSIGN_POST',
					type: 'POST',
					loading: false,
					param: {
						project_id: this.project_id,
						depart_id
					},
					autoTip: true
				}).then((res) => {
					this.$emit("sure");
					setTimeout(() => {
						this.$store.commit('COLLAGE_SERVICE_LIST_RESET', { type: this.type });
					}, 500);
				}).catch(error => {});
			}).catch(error => {});
		},
		handleLoadBtn(data) {
			this.authType = data.authType;
		}
	}
};

export const DetailDrawer = CreatePortal({ alive: true }, module.exports.default);
</script>

<style lang="scss">
.v-collage-service-detail {
	.ivu-tabs{
		.ivu-tabs-tabpane{
			overflow-x: hidden;
			overflow-y: auto;
			max-height: 100%;
		}

		.ivu-tabs-content{
			height: calc(100% - 34px);
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

	.ivu-drawer-body {
		padding: 0px;
		overflow-y: hidden;

		.ivu-tabs-tab {
			padding: 6px 0;
			margin: 0 15px;
		}

		.ivu-tabs-tab:hover {
			color: #e84854;
		}

		.ivu-tabs-ink-bar {
			display: none;
		}

		.ivu-tabs-nav-scroll {
			background: #f5f5f6;
			border-bottom: 2px solid #d4d7db;
		}

		.ivu-tabs-tab-focused,
		.ivu-tabs-nav-container:focus .ivu-tabs-tab-focused {
			color: #e74854;
			border-color: #e74854!important;
			border-bottom: 2px #e74854 solid !important;
		}

		.ivu-tabs-nav .ivu-tabs-tab-active {
			color: #e84854;
		}
		
		.ivu-tabs-bar{
			margin-bottom: 0px;
		}
	}
}
</style>