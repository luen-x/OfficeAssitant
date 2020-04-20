<template>
	<i-drawer
		v-model="visible"
		:mask="false"
		:mask-closable="false"
		class="v-sale-white-company-detail"
		@on-close="handleCancel"
	>
		<h2 class="_detail-header g-fs-16">
			{{ basicInfo.company_name || '--' }}
		</h2>
		<div
			class="g-m-t-5 g-fs-12 g-flex g-fw-w"
			style="padding:0 16px"
		>
			<div
				class="_basic"
			>
				<span class="__info g-c-black4">客户类型：</span>
				<span class="g-c-black2">{{ basicInfo.customer_type_str || '--' }}</span>
			</div>
			<div
				class="_basic"
				style="width:50%"
			>
				<span class="__info g-c-black4">具体行业：</span>
				<span class="g-c-black2">
					{{ basicInfo.industry_id_str ?
					`${basicInfo.industry_id_str}  ${basicInfo.industry_id_second_str}  ${basicInfo.industry_id_third_str}`:'--' }}</span>
			</div>
		</div>
		<i-tabs
			v-if="detailVisible"
			value="customerInfo"
			@on-click="handleChangeTab"
		>
			<i-tab-pane
				label="客户信息"
				name="customerInfo"
				class="_detail-content"
			>
				<keep-alive>
					<oa-white-customer-info
						v-if="tabs == 'customerInfo'"
						:white-id="whiteId"
						:type="type"
						@reset="loadData"
					/>
				</keep-alive>
			</i-tab-pane>
			<template v-if="type!=0">
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
			</template>
			<!-- <i-tab-pane
				v-if="type != 0"
				label="联系人"
				name="contact"
				class="_detail-content"
			>
				<keep-alive>
					<oa-white-contact
						v-if="tabs == 'contact'"
						:customer-id="customerId"
						@reset="loadData"
					/>
				</keep-alive>
			</i-tab-pane>
			<i-tab-pane
				v-if="type != 0"
				label="销售记录"
				name="saleRecord"
				class="_detail-content"
			>
				<keep-alive>
					<oa-white-record
						v-if="tabs == 'saleRecord'"
						:customer-id="customerId"
						@reset="loadData"
					/>
				</keep-alive>
			</i-tab-pane> -->
		</i-tabs>
	</i-drawer>
</template>

<script>
import { Drawer, Tabs, TabPane, Tooltip } from 'iview';
import { CreatePortal } from 'wya-vc';
import orderModal from '@extends/mixins/orderModal';
import FollowRecord from '@components/sale/_common/customer/popup/customer-detail/parts/follow-record';
import TurnRecord from '@components/sale/_common/customer/popup/customer-detail/parts/turn-record';
import RelateCustomer from '@components/sale/_common/customer/popup/customer-detail/parts/relate-customer';
import { WhiteCustomerInfo } from "./customer-info";
import { WhiteContact } from "./contact";
import { WhiteRecord } from './record';

export default {
	name: "oa-white-company-detail",
	components: {
		'i-drawer': Drawer,
		'oa-white-customer-info': WhiteCustomerInfo,
		'oa-white-contact': WhiteContact,
		'oa-white-record': WhiteRecord,
		'i-tabs': Tabs,
		'oa-sale-relate-customer': RelateCustomer,
		'oa-sale-follow-record': FollowRecord,
		'oa-sale-turn-record': TurnRecord,
		'i-tab-pane': TabPane,
		'i-tooltip': Tooltip,
	},
	mixins: [orderModal],
	props: {
		type: [String, Number],
		customerId: [String, Number],
		whiteId: [String, Number]
	},
	data() {
		return {
			visible: false,
			detailVisible: true,
			tabs: 'customerInfo',
			basicInfo: {}, // 基本信息
		};
	},
	watch: {
		whiteId() {
			this.loadData();
		}
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
			if (this.type == 0) {
				this.detailVisible = false;
				this.$nextTick(() => {
					this.tabs = 'customerInfo';
					this.detailVisible = true;
				});
			}

			this.$request({
				url: '_SALE_SEA_WHITE_HEAD_INFO_GET',
				type: 'GET',
				loading: false,
				param: {
					white_id: this.whiteId
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
		}
	}
};

export const WhiteCompanyDetail = CreatePortal({ alive: true }, module.exports.default);
</script>
<style lang="scss">
.v-sale-white-company-detail {
	._detail-header {
		color: #000;
		padding: 16px 40px 16px 16px;
		font-weight: normal;
	}
	._basic {
		width: 22%;
		margin-bottom: 12px;
	}
	._detail-content {
		padding: 0 16px;
	}
	.ivu-drawer.ivu-drawer-right {
		width: 720px !important;
	}
	.ivu-tabs {
		height: calc(100% - 130px);
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
