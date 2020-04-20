<template>
	<i-drawer
		v-model="closable"
		:mask="false"
		:mask-closable="false"
		class-name="v-sale-main-service-detail"
		@on-close="handleCancel">
		<div class="g-m-t-30" style="padding-left:22px">
			<div class="g-c-black2 g-fs-18">
				{{ data.company_name }}
			</div>
			<div class="g-flex g-fw-w g-m-t-10" >
				<i-head-item :values="customer_base_info.customer_name" labels="客户姓名"/>
				<i-head-item :values="customer_base_info.phone" labels="客户手机号"/>
				<i-head-item
					:values="customer_base_info.industry_name"
					labels="行业"/>
				<i-head-item
					:values="customer_base_info.province_name+customer_base_info.city_name+customer_base_info.area_name"
					labels="地区"/>
				<i-head-item :values="customer_base_info.capital" labels="注册资金">
					<div v-if="customer_base_info.capital" >
						{{ customer_base_info.capital }}万元
					</div>
				</i-head-item>
				<i-head-item :values="customer_base_info.service_person" labels="服务人">
					<div v-if="customer_base_info.service_person" >
						{{ customer_base_info.service_person }}({{ customer_base_info.service_person_depart }})
					</div>
				</i-head-item>
				<i-head-item :values="customer_base_info.depart_manage" labels="部门经理"/>
			</div>
		</div>
		<i-tabs
			v-if="!loading"
			:value="tabs"
			class="g-m-t-20"
			@on-click="handleSwitchTabs">
			<i-tab-pane label="客户信息" name="customer">
				<keep-alive>
					<oa-customer
						ref="customer"
						:contract_company_id="contract_company_id"
						:data="data"
						:option="false"
					/>
				</keep-alive>
			</i-tab-pane>
			<i-tab-pane label="回访记录" name="returnRecord">
				<keep-alive>
					<oa-return-record
						:from-other="false"
						:contract-company-id="contract_company_id"
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
						:contract_company_id="contract_company_id"
					/>
				</keep-alive>
			</i-tab-pane>

			<i-tab-pane v-if="$auth[1502]" label="质检录音" name="callHistory">
				<keep-alive>
					<oa-call-history :contract_company_id="contract_company_id"/>
				</keep-alive>
			</i-tab-pane>
		</i-tabs>
	</i-drawer>
</template>

<script>
import { Drawer, Row, Col, Button, Tabs, TabPane } from "iview";
import { CreatePortal } from "wya-vc";
import Explain from "@components/_common/explain/explain";
import API_ROOT from "@stores/apis/root";
import returnRecord from '@components/sale/_common/service/check';
import customer from "@components/sc/_common/service-manage-detail/customer";
import ClassRecord from "@components/sc/_common/service-manage-detail/class-record";
import ServiceSitution from "@components/sc/_common/service-manage-detail/service-situation";
import callHistory from "@components/sc/_common/service-manage-detail/call-history";
import headItem from './common/headItem';

export default {
	name: "v-sale-main-service-detail",

	components: {
		"i-drawer": Drawer,
		"i-button": Button,
		"i-tabs": Tabs,
		"i-tab-pane": TabPane,
		"i-head-item": headItem,
		"oa-customer": customer,
		"oa-call-history": callHistory,
		"oa-return-record": returnRecord,
		"oa-class-record": ClassRecord,
		"oa-service-sitution": ServiceSitution,
	},

	props: {
		type: String,
		quality_id: Number,
		contract_company_id: Number,
		flag: Number,
		name: String,
		data: Object
	},
	data() {
		return {
			closable: false,
			customer_base_info: {},
			tabs: 'customer',
			loading: false
		};
	},
	watch: {
		contract_company_id() {
			this.loadHeadData();
		}
	},
	mounted() {
		// this.loadData();
		this.closable = true;
		this.loadHeadData();
	},
	methods: {
		handleSwitchTabs(name) {
			this.tabs = name;
		},
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
		// 头部信息
		loadHeadData() {
			this.loading = true;
			this.$request({
				url: API_ROOT._SC_MANAGE_INSPECTION_QUALITY_CUSTOMER_BASE_INFO_GET,
				type: "GET",
				param: {
					contract_company_id: this.data.contract_company_id
				},
				loading: false
			}).then(res => {
				this.loading = false;
				this.customer_base_info = res.data;
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
	}
};

export const serviceDetail = CreatePortal({
	alive: true
}, module.exports.default);
</script>

<style lang="scss">
.v-sale-main-service-detail {
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