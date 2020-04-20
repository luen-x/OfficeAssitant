<template>
	<i-drawer
		v-model="closable"
		:mask="false"
		:mask-closable="false"
		class="v-sc-customer-predistribute-detail"
		@on-close="handleCancel"
	>
		<oa-head 
			:contract_company_id="contract_company_id" 
			:customer_base_info="customer_base_info"
			:data="data"
		/>

		<i-tabs
			v-if="detailShow"
			:value="tabs"
			class="g-m-t-20"
			@on-click="handleSwitchTabs"
		>
			<i-tab-pane label="客户信息" name="customer">
				<keep-alive>
					<oa-customer 
						v-if="tabs === 'customer'" 
						ref="customer"
						:contract_company_id="contract_company_id"
						:data="data"
						:option="option"
					/>
				</keep-alive>
			</i-tab-pane>
			<i-tab-pane label="制作进度" name="process">
				<keep-alive>
					<oa-service-manage-process 
						v-if="tabs === 'process'"
						:contract_company_id="contract_company_id"
					/>
				</keep-alive>
			</i-tab-pane>
			<i-tab-pane label="回访记录" name="returnRcords">
				<keep-alive>
					<oa-return-record
						v-if="tabs === 'returnRcords'"
						ref="returnRecord"
						:contract_company_id="contract_company_id"
						:name="name"
						:type="type"
						:option="option"
					/>
				</keep-alive>
			</i-tab-pane>
			<i-tab-pane label="服务情况" name="ServiceSitution">
				<keep-alive>
					<oa-service-sitution 
						v-if="tabs === 'ServiceSitution'" 
						:contract_company_id="contract_company_id"
					/>
				</keep-alive>
			</i-tab-pane>
			<i-tab-pane label="上课记录" name="classRecord">
				<keep-alive>
					<oa-class-record
						v-if="tabs === 'classRecord'" 
						:contract_company_id="contract_company_id"
					/>
				</keep-alive>
			</i-tab-pane>
			<i-tab-pane label="投诉记录" name="ServiceManageComplaint">
				<keep-alive>
					<oa-service-manage-complaint 
						v-if="tabs === 'ServiceManageComplaint'" 
						ref="complaint"
						:contract_company_id="contract_company_id"
						:name="name"
						:option="option"
					/>
				</keep-alive>
			</i-tab-pane>
			<i-tab-pane label="其他信息" name="ServiceManageIntegral">
				<keep-alive>
					<oa-service-manage-integral 
						v-if="tabs === 'ServiceManageIntegral'"
						:contract_company_id="contract_company_id"
					/>
				</keep-alive>
			</i-tab-pane>
			<i-tab-pane v-if="$auth[1012] || $auth[1014]" label="通话记录" name="CallHistory">
				<keep-alive>
					<oa-call-history 
						v-if="tabs === 'CallHistory'"
						:option="option"
						:contract_company_id="contract_company_id"
					/>
				</keep-alive>
			</i-tab-pane>
		</i-tabs>

		<div 
			v-if="(flag != 3 && $auth[340] && name === 'manage' || $auth[348] && name === 'inspection') && option" 
			class="_footer"
		>
			<i-button style="margin-right: 8px" type="primary" @click="handleReturn">
				回访
			</i-button>

			<i-button 
				v-if="tabs === 'customer' && $auth[1008]" 
				style="margin-right: 8px" 
				@click="handleAddContract"
			>
				添加联系方式
			</i-button>

			<i-button 
				v-if="tabs === 'ServiceManageComplaint' && ($auth[342] && name === 'manage' || $auth[349] && name === 'inspection')" 
				style="margin-right: 8px" 
				@click="handleAddEditComplaint"
			>
				添加投诉记录
			</i-button>
		</div>
	</i-drawer>
</template>

<script>
import { Drawer, Row, Col, Button, Tabs, TabPane } from "iview";
import { CreatePortal } from "wya-vc";
import Explain from "@components/_common/explain/explain";
import API_ROOT from "@stores/apis/root";
import Head from "./head";
import ReturnRecords from "./return-records";
import Customer from "./customer";
import ServiceManageProcess from "./service-manage-process";
import ServiceSitution from "./service-situation";
import ServiceManageComplaint from "./service-manage-complaint";
import ServiceManageIntegral from "./service-manage-integral";
import { ReturnsModal } from "../../manage-inspection/modal/returns";
import { AddEditComplaintModal } from "./add-edit-complaint";
import { ContractModal } from "../add-contract";
import CallHistory from "./call-history";
import ClassRecord from "./class-record";

export default {
	name: "sc-manage-inspection-detail-drawer",

	components: {
		"i-drawer": Drawer,
		"i-button": Button,
		"i-tabs": Tabs,
		"i-tab-pane": TabPane,
		"oa-explain": Explain,
		"oa-head": Head,
		"oa-return-record": ReturnRecords,
		"oa-customer": Customer,
		"oa-service-manage-process": ServiceManageProcess,
		"oa-service-sitution": ServiceSitution,
		"oa-service-manage-complaint": ServiceManageComplaint,
		"oa-service-manage-integral": ServiceManageIntegral,
		"oa-call-history": CallHistory,
		"oa-class-record": ClassRecord
	},

	props: {
		type: String,
		quality_id: Number,
		contract_company_id: Number,
		flag: Number,
		name: String,
		data: Object,
		option: {
			type: Boolean,
			default: true
		}, // 是否显示操作
	},

	data() {
		return {
			closable: false,
			show: false,
			detailShow: true,
			tabs: "",
			customer_base_info: {}
		};
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
				this.tabs = "customer";
			});

			this.loadHeadData();
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
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
        
		// 回访
		handleReturn() {
			ReturnsModal.popup({
				quality_id: this.quality_id,
				contract_company_id: this.contract_company_id,
				name: this.name,
				type: this.type
			}).then(res => {
				if (res) {
					this.tabs = "returnRcords";
					let reset = this.flag == 1 ? "SC_MANAGE_INSPECTION_LIST_RESET" : "SC_SERVICE_INSPECTION_LIST_RESET";
					this.$store.commit(reset, { type: this.type });
					this.$refs.returnRecord ? this.$refs.returnRecord.loadData() : this.$nextTick(() => {
						this.$refs.returnRecord.loadData();
					});
				}
			});
		},

		// 添加联系人
		handleAddContract() {
			ContractModal.popup({
				name: "add",
				contract_company_id: this.contract_company_id
			}).then(res => {
				this.$refs.customer.loadListData();
			});
		},

		handleAddEditComplaint() {
			AddEditComplaintModal.popup({
				contract_company_id: this.contract_company_id,
				name: "add"
			}).then(res => {
				res && this.$refs.complaint.loadData();
			});
		}
	}
};

export const DetailDrawer = CreatePortal({
	alive: true
}, module.exports.default);
</script>

<style lang="scss">
.v-sc-customer-predistribute-detail {
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