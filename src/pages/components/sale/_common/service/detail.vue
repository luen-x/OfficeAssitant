<template>
	<i-drawer 
		v-model="visible" 
		:mask-closable="false" 
		:mask="false" 
		class="v-sale-service-detail"
		@on-close="handleCancel"
	>
		<h2 class="_detail-header _company g-fs-16">
			<span>{{ basicInfo.contract_company_name || '--' }}</span>
		</h2>
		<div 
			class="g-m-t-5 g-fs-12 g-flex g-fw-w"
			style="padding:0 16px"
		>
			<div class="_basic">
				<span class="g-c-black4">客户姓名：</span>
				<span class="g-c-black2">{{ basicInfo.customer_name || '--' }}</span>
			</div>
			<div class="_basic">
				<span class="__info g-c-black4">客户手机号：</span>
				<span class="g-c-black2">{{ basicInfo.phone || '--' }}</span>
			</div>
			<div class="_basic">
				<span class="__info g-c-black4">行业：</span>
				<span class="g-c-black2">{{ basicInfo.industry || '--' }}</span>
			</div>
			<div class="_basic">
				<span class="__info g-c-black4">地区：</span>
				<span class="g-c-black2">
					{{ basicInfo.province_name + '-' + basicInfo.city_name + '-' + basicInfo.area_name || '--' }}
				</span>
			</div>
			<div class="_basic">
				<span class="__info g-c-black4">注册资金：</span>
				<span class="g-c-black2">{{ basicInfo.capital ? basicInfo.capital !== '-1.00万' ? `${basicInfo.capital}` : '--' : "--" }}</span>
			</div>
			<div class="_basic g-flex">
				<span class="__info g-c-black4">服务人：</span>
				<span v-if="basicInfo.staff_name">
					<i-tooltip 
						v-if="basicInfo.staff_name.length > 5"
						:content="basicInfo.staff_name"
						theme="dark"
						placement="bottom"
					>
						<span class="g-c-black2">
							{{ basicInfo.staff_name.substr(0, 5) + '...' }}
						</span>
					</i-tooltip>
					<span v-else>{{ basicInfo.staff_name }}</span>
				</span>
				<span v-else class="g-c-black2">--</span>
			</div>
			<div class="_basic">
				<span class="__info g-c-black4">部门经理：</span>
				<span v-if="basicInfo.depart_manage_names">
					<i-tooltip 
						v-if="basicInfo.depart_manage_names.length > 5"
						:content="basicInfo.depart_manage_names"
						theme="dark"
						placement="bottom"
					>
						<span class="g-c-black2">
							{{ basicInfo.depart_manage_names.substr(0, 5) + '...' }}
						</span>
					</i-tooltip>
					<span v-else>{{ basicInfo.depart_manage_names }}</span>
				</span>
				<span v-else class="g-c-black2">--</span>
			</div>
			<div class="_basic">
				<span class="__info g-c-black4">总服务提成：</span>
				<span class="g-c-black2">
					{{ basicInfo.service_amount + '/' + basicInfo.need_service_amount || '--' }}
				</span>
			</div>
		</div>
		<i-tabs
			:value="tabs"
			@on-click="handleChangeTab"
		>
			<!-- <i-tab-pane 
				label="客户信息" 
				name="customerInfo"
			>
				<oa-loading v-if="loading"/>
				<keep-alive>
					<oa-service-customer-info 
						v-if="tabs == 'customerInfo'"
						:customer-info="customer_info"
						:contract-list="contract_list"
					/>
				</keep-alive>
			</i-tab-pane> -->
			<i-tab-pane 
				label="服务提成" 
				name="royalty"
			>
				<keep-alive>
					<oa-service-royalty 
						v-if="tabs == 'royalty'" 
						:from-other="fromOther"
						:contract-company-id="contractCompanyId"
						@reset="loadData"
					/>
				</keep-alive>
			</i-tab-pane>
			<i-tab-pane 
				label="产品制作进度" 
				name="progress"
			>
				<keep-alive>
					<oa-service-progress 
						v-if="tabs == 'progress'"
						:contract-company-id="contractCompanyId"
						@reset="loadData"
					/>
				</keep-alive>
			</i-tab-pane>
			<i-tab-pane 
				label="质检跟进" 
				name="follow"
			>
				<keep-alive>
					<oa-service-quality-check 
						v-if="tabs == 'follow'"
						:from-other="fromOther"
						:contract-company-id="contractCompanyId"
						@reset="loadData"
					/>
				</keep-alive>
			</i-tab-pane>
			<i-tab-pane 
				label="投诉信息" 
				name="complain"
			>
				<keep-alive>
					<oa-service-complaint 
						v-if="tabs == 'complain'" 
						:contract-company-id="contractCompanyId"
						@reset="loadData"
					/>
				</keep-alive>
			</i-tab-pane>
			<i-tab-pane 
				label="回款/满意度" 
				name="integral"
			>
				<keep-alive>
					<oa-service-integral 
						v-if="tabs == 'integral'" 
						:from-other="fromOther"
						:contract-company-id="contractCompanyId"
						@reset="loadData"
					/>
				</keep-alive>
			</i-tab-pane>
		</i-tabs>
		<div 
			v-if="!fromOther" 
			class="_btn-box g-flex g-jc-fs g-ai-c"
		>
			<i-button 
				type="primary" 
				@click="handleDoService"
			>
				做服务
			</i-button>
			<i-select 
				ref="my-select"
				placeholder="更多"
				clearable
				transfer
				class="__more g-m-l-10"
				@on-change="handleChecked"
			>
				<i-option 
					v-if="$auth[494]"
					:value="1"
				>
					提交回款/满意度信息
				</i-option>
				<i-option 
					v-if="type !== '1' && type !== '2' && enableOpen" 
					:value="2"
				>
					开启服务
				</i-option>
				<i-option 
					v-if="(type !== '2' && type !== '3' && !enableOpen) && $auth[495]" 
					:value="3"
				>
					申请暂停服务
				</i-option>
			</i-select>
		</div>
	</i-drawer>
</template>

<script>
import { Drawer, Tabs, TabPane, Button, Select, Option, Tooltip } from 'iview';
import { CreatePortal } from 'wya-vc';
import { setTimeout } from 'timers';
import Loading from '@components/_common/loading/loading';
import { Confirm } from '@components/_common/confirm/confirm';
import orderModal from '@extends/mixins/orderModal';
import { ServiceProgress } from './progress';
import { ServiceQualityCheck } from './check';
import { ServiceRoyalty } from './royalty';
import { ServiceComplaint } from './complaint';
import { ServiceIntegral } from './integral';
import { ServiceStop } from "./stop";
import { ServiceSubmitIntegral } from './submit-integral';

export default {
	name: "oa-service-detail",
	components: {
		'i-drawer': Drawer,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
		'oa-service-progress': ServiceProgress,
		'oa-service-quality-check': ServiceQualityCheck,
		'oa-service-royalty': ServiceRoyalty,
		'oa-service-complaint': ServiceComplaint,
		'oa-service-integral': ServiceIntegral,
		"i-tooltip": Tooltip,
		'oa-loading': Loading,
		"i-button": Button,
		"i-select": Select,
		"i-option": Option,
	},
	mixins: [orderModal],
	props: {
		type: [String, Number],
		enableOpen: [String, Number],
		fromOther: Boolean,
		customerServiceId: [String, Number],
		contractCompanyId: [String, Number],
		pathName: String,
		tabName: String
	},
	data() {
		return {
			visible: false,
			tabs: this.tabName || 'royalty',
			basicInfo: {}, // 客户信息
		};
	},
	watch: {
		customerServiceId() {
			this.loadData();
		}
	},
	mounted() {
		this.visible = true;
		this.loadData();
	},
	methods: {
		/**
		 * 初始化加载
		 */
		loadData() {
			this.$request({
				url: '_SALE_SERVICE_CUSTOMER_INFO_GET',
				type: 'GET',
				loading: false,
				param: {
					contract_company_id: this.contractCompanyId
				},
				autoTip: false
			}).then(res => {
				this.basicInfo = res.data;
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		/**
		 * 点击取消
		 */
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		/**
		 * 切换tab
		 */
		handleChangeTab(name) {
			this.tabs = name;
		},
		/**
		 * 点击更多
		 */
		handleChecked(value) {
			switch (value) {
				case 1:
					ServiceSubmitIntegral.popup({
						contractCompanyId: this.contractCompanyId
					}).then(() => {
						this.$emit('sure', {
							status: 1
						});
					}).catch(error => {
						error && console.error(error);
					});
					this.$refs["my-select"].clearSingleSelect();
					break;
				case 2:
					this.handleStart();
					this.$refs["my-select"].clearSingleSelect();
					break;
				case 3:
					this.handleStop();
					this.$refs["my-select"].clearSingleSelect();
					break;
				default:
					break;
			}
		},
		/**
		 * 点击做服务
		 */
		handleDoService() {
			if (this.pathName) {
				this.visible = false;
				this.$emit('close');
				setTimeout(() => {
					this.$router.push({ 
						name: this.pathName,
						query: {
							contractCompanyId: this.contractCompanyId,
							customerServiceId: this.customerServiceId,
							pathName: this.pathName
						}
					});
				}, 300);
			} else {
				this.visible = false;
				this.$emit('close');
			}
		},
		/**
		 * 暂停服务
		 */
		handleStop() {
			this.$request({
				url: '_SALE_SERVICE_APPLY_GET',
				type: "GET",
				loading: false,
				param: {
					contract_company_id: this.contractCompanyId
				},
				autoTip: false
			}).then(res => {
				if (res.data.apply_status) {
					ServiceStopSimple.popup({
						level: res.data.level,
						applyStatus: res.data.apply_status,
						contractCompanyId: this.contractCompanyId
					}).then(() => {
						this.$emit('sure', {
							status: 1
						});
					}).catch(error => {
						error && console.error(error);
					});
				} else if (res.data.level === 1 || res.data.level === 2) {
					ServiceStop.popup({
						auditSchedule: res.data.audit_schedule,
						contractCompanyId: this.contractCompanyId
					}).then(() => {
						this.$emit('sure', {
							status: 1
						});
					}).catch(error => {
						error && console.error(error);
					});
				} else {
					ServiceStopSimple.popup({
						level: res.data.level,
						applyStatus: res.data.apply_status,
						contractCompanyId: this.contractCompanyId
					}).then(() => {
						this.$emit('sure', {
							status: 1
						});
					}).catch(error => {
						error && console.error(error);
					});
				}
			}).catch((error) => {
				this.$Message.error(error.msg);
			});
		},
		/**
		 * 开启服务
		 */
		handleStart() {
			Confirm.popup({
				title: '开启服务确认',
				msg: '确认重新开启该客户的服务？'
			}).then(() => {
				this.$request({
					url: '_SALE_SERVICE_OPEN_APPLY_POST',
					type: "POST",
					loading: false,
					param: {
						contract_company_id: this.contractCompanyId
					},
					autoTip: true
				}).then(() => {
					this.$emit('sure', {
						status: 1
					});
				}).catch(error => {});
			}).catch((error) => {
				error && console.error(error);
			});
		}
	}
};

export const ServiceDetail = CreatePortal({ alive: true }, module.exports.default);

</script>
<style lang="scss">
.v-sale-service-detail {
	._detail-header {
		color: #000;
		padding: 16px 40px 16px 16px;
		font-weight: normal;
	}
	._basic {
		margin-bottom: 12px;
		margin-right: 30px;
	}
	._btn-box {
		width: 100%;
		height: 60px;
		background-color: #fff;
		position: absolute;
		bottom: 0;
		left: 0;
		padding: 0 16px;
		-webkit-box-shadow: 0px -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
		box-shadow: 0px -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
	}
	.ivu-drawer.ivu-drawer-right {
		width: 720px !important;
	}
	.ivu-drawer-body {
		padding: 0;
	}
	.ivu-tabs-bar {
		background-color:#f6f6f6;
		margin-bottom: 0;
	}
	.ivu-tabs-tab {
		padding: 6px 0;
		margin: 0 15px;
	}
	.ivu-tabs-tab:hover {
		color: #e84854;
	}
	.ivu-tabs-tab-focused,
	.ivu-tabs-nav-container:focus .ivu-tabs-tab-focused {
		color: #e74854;
		border-color: #e74854!important;
		border-bottom: 3px #e74854 solid !important;
	}
	.ivu-tabs-nav .ivu-tabs-tab-active {
		color: #e84854;
	}
	.ivu-tabs-ink-bar {
		background-color:#e84854;
		display: none;
	}
	.ivu-tabs {
		height: calc(100% - 200px);
	}
	.ivu-tabs-tabpane {
		overflow-y: overlay;
		overflow-x: hidden;
		max-height: 100%;
	}
	.ivu-tabs-content {
		height: calc(100% - 30px);
	}
	.ivu-select {
		width: 60px;
		color: #e84854;
	}
	.ivu-select-selection {
		border: 1px solid #e84854;
		box-shadow: none;
	}
	.ivu-icon-ios-arrow-down:before {
		color: #e84854;
	}
	.ivu-select-placeholder {
		color: #e84854!important;
	}
}
</style>
