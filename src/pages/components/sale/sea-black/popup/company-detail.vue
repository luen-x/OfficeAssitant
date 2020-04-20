<template>
	<i-drawer
		v-model="visible"
		:mask="false"
		:mask-closable="false"
		class="v-sale-black-company-detail"
		@on-close="handleCancel"
	>
		<h2 class="_detail-header g-fs-16">{{ company_name || '--' }}</h2>
		<div
			class="g-m-t-5 g-fs-12 g-flex g-fw-w"
			style="padding:0 16px"
		>
			<div class="_basic">
				<span class="__info g-c-black4">收回时间：</span>
				<span class="g-c-black2">{{ recovery_time || '--' }}</span>
			</div>
			<div class="_basic">
				<span class="g-c-black4">客户类型：</span>
				<span class="g-c-black2">{{ headInfo.customer_type_str || '--' }}</span>
			</div>
			<div class="_basic">
				<span class="__info g-c-black4">具体行业：</span>
				<span class="g-c-black2">
					{{ headInfo.industry_id_str ?
					`${headInfo.industry_id_str}  ${headInfo.industry_id_second_str}  ${headInfo.industry_id_third_str}`:'--' }}</span>
			</div>
		</div>
		<i-tabs
			:style="tabs == 'customerInfo'?'height:calc(100% - 162px)':'height:calc(100% - 102px)'"
			value="customerInfo"
			@on-click="handleChangeTab"
		>
			<i-tab-pane
				label="客户信息"
				name="customerInfo"
				class="_detail-content"
			>
				<keep-alive>
					<oa-black-customer-info
						v-if="tabs == 'customerInfo'"
						:customer-id="customerId"
						:read-only="readOnly"
						@reset="loadData"
					/>
				</keep-alive>
			</i-tab-pane>
			<i-tab-pane label="跟进记录" name="followRecord" style="padding-left:20px">
				<oa-sale-follow-record v-if="tabs=='followRecord'" :customer-id="customerId"/>
			</i-tab-pane>
			<i-tab-pane label="关联客户" name="relateCustomer" style="padding-left:20px">
				<oa-sale-relate-customer
					v-if="tabs=='relateCustomer'"
					:customer-id="customerId"
				/>
			</i-tab-pane>
			<i-tab-pane label="资料转手记录" name="turnRecord" style="padding-left:20px">
				<oa-sale-turn-record v-if="tabs=='turnRecord'" :customer-id="customerId"/>
			</i-tab-pane>
		</i-tabs>
		<div
			v-if="!readOnly && tabs == 'customerInfo' && showBtn && (
				((type == '2' || (type == '0' && status == 2)) && $auth[687])
				|| (type == '2' && $auth[688])
				|| ((type == '1' || (type == '0' && status == 1)) && $auth[689])
			)"
			class="_btn-box g-flex g-ai-c"
		>
			<i-button
				v-if="(type == '2' || (type == '0' && status == 2)) && $auth[687]"
				class="g-m-l-10"
				@click="handleCancelMark"
			>
				驳回标记
			</i-button>
			<i-button
				v-if="type == '2' && $auth[688]"
				class="g-m-l-10"
				@click="handleConfirm"
			>
				确认黑名单
			</i-button>
			<i-button
				v-if="(type == '1' || (type == '0' && status == 1)) && $auth[689]"
				class="g-m-l-10"
				@click="handleRecovery"
			>
				恢复至公海
			</i-button>
		</div>
	</i-drawer>
</template>

<script>
import { Drawer, Tabs, TabPane, Button } from 'iview';
import { CreatePortal } from 'wya-vc';
import orderModal from '@extends/mixins/orderModal';
import { Confirm } from '@components/_common/confirm/confirm';
import FollowRecord from '@components/sale/_common/customer/popup/customer-detail/parts/follow-record';
import TurnRecord from '@components/sale/_common/customer/popup/customer-detail/parts/turn-record';
import RelateCustomer from '@components/sale/_common/customer/popup/customer-detail/parts/relate-customer';
import { BlackCustomerInfo } from "./customer-info";
import { BlackContact } from "./contact";
import { BlackRecord } from './record';

export default {
	name: "oa-black-company-detail",
	components: {
		'i-drawer': Drawer,
		'oa-black-customer-info': BlackCustomerInfo,
		'oa-black-contact': BlackContact,
		'oa-black-record': BlackRecord,
		'oa-sale-relate-customer': RelateCustomer,
		'oa-sale-follow-record': FollowRecord,
		'oa-sale-turn-record': TurnRecord,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
		'i-button': Button
	},
	mixins: [orderModal],
	props: {
		type: [String, Number],
		status: [String, Number],
		customerId: [String, Number],
		showBtn: {
			type: Boolean,
			default: true
		},
		readOnly: Boolean
	},
	data() {
		return {
			visible: false,
			tabs: 'customerInfo',
			company_name: '',
			recovery_time: '',
			staff_name: '',
			info_source_name: '',
			headInfo: {},
		};
	},
	watch: {
		customerId() {
			this.loadData();
		}
	},
	beforeCreate() {
		this.Button = Button;
	},
	mounted() {
		this.visible = true;
		this.loadData();
		this.$vc.on('SALE_CLOSE_CUSTOMER_DETAIL', () => {
			this.visible = false;
			this.$emit('close');
		});
	},
	destroyed() {
		this.handleCancel();
		this.$vc.off('SALE_CLOSE_CUSTOMER_DETAIL');
	},
	methods: {
		/**
		 * 初始化加载
		 */
		loadData() {
			this.$request({
				url: '_SALE_SEA_INFO_HEAD_GET',
				type: 'GET',
				loading: false,
				param: {
					customer_id: this.customerId
				},
				autoTip: false
			}).then(res => {
				this.headInfo = res.data;
				this.company_name = res.data.company_name;
				this.recovery_time = res.data.recovery_time;
				this.staff_name = res.data.staff_name;
				this.info_source_name = res.data.info_source_name;
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
		 * 取消标记
		 */
		handleCancelMark() {
			Confirm.popup({
				title: '取消标记',
				msg: this.$auth[688]
					? `取消“${this.company_name}”的所有标记后所有员工可继续在公海领取该资料，确认取消？`
					: `确定取消对“${this.company_name}”标记？`
			}).then(() => {
				this.$request({
					url: '_SALE_SEA_BLACK_CANCEL_MARK_POST',
					type: "POST",
					loading: false,
					param: {
						customer_id: this.customerId
					},
					autoTip: true
				}).then(() => {
					this.$emit('sure', {
						status: 1
					});
				});
			}).catch(error => {
				error && console.error(error);
			});
		},
		/**
		 * 确认黑名单
		 */
		handleConfirm() {
			Confirm.popup({
				title: '确认黑名单',
				msg: `将“${this.company_name}”加入黑名单后，该资料将不在公海展示，确认加入？`
			}).then(() => {
				this.$request({
					url: '_SALE_SEA_BLACK_CONFIRM_POST',
					type: "POST",
					loading: false,
					param: {
						customer_id: [this.customerId]
					},
					autoTip: true
				}).then(() => {
					this.$emit('sure', {
						status: 1
					});
				});
			}).catch(error => {
				error && console.error(error);
			});
		},
		/**
		 * 恢复至公海
		 */
		handleRecovery() {
			Confirm.popup({
				title: '恢复至公海',
				msg: `是否确认将“${this.company_name}”恢复至公海？`
			}).then(() => {
				this.$request({
					url: '_SALE_SEA_BLACK_RECOVERY_POST',
					type: "POST",
					loading: false,
					param: {
						customer_id: [this.customerId]
					},
					autoTip: true
				}).then(() => {
					this.$emit('sure', {
						status: 1
					});
				});
			}).catch(error => {
				error && console.error(error);
			});
		}
	}
};

export const BlackCompanyDetail = CreatePortal({ alive: true }, module.exports.default);
</script>
<style lang="scss">
.v-sale-black-company-detail {
	._detail-header {
		color: #000;
		padding: 16px 40px 16px 16px;
		font-weight: normal;
	}
	._basic {
		margin-right: 50px;
		margin-bottom: 12px;
	}
	._detail-content {
		padding: 0 16px;
	}
	._btn-box {
		width: 100%;
		height: 60px;
		position: absolute;
		bottom: 0;
		left: 0;
		padding: 0 16px;
		background-color: #fff;
		border-top: 1px solid #e8e8e8;
		-webkit-box-shadow: 0px -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
		box-shadow: 0px -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
	}
	.ivu-drawer.ivu-drawer-right {
		width: 720px !important;
	}
	.ivu-tabs-tab {
		padding: 6px 0;
		margin: 0 15px;
	}
	.ivu-drawer-body {
		padding: 0;
	}
	.ivu-tabs-bar {
		background-color:#f6f6f6;
		margin-bottom: 0;
	}
	.ivu-tabs-tab:hover {
		color: #e84854;
	}
	.ivu-tabs-nav .ivu-tabs-tab-active {
		color: #e84854;
	}
	.ivu-tabs-ink-bar {
		background-color:#e84854;
		display: none;
	}
	.ivu-tabs-tab-focused,
	.ivu-tabs-nav-container:focus .ivu-tabs-tab-focused {
		color: #e74854;
		border-color: #e74854!important;
		border-bottom: 3px #e74854 solid !important;
	}
	.ivu-tabs-tabpane {
		overflow-y: auto;
		overflow-x: hidden;
		max-height: 100%;
	}
	.ivu-tabs-content {
		height: calc(100% - 34px);
	}
}
</style>
