<template>
	<i-drawer
		v-model="visible"
		:mask-closable="false"
		:mask="false"
		class="v-sale-customer-detail-side"
		@on-close="handleCancel"
	>
		<div
			class="_head-title"
		>
			{{ baseInfo.contract_company_name }}
			<template v-if="data.refund_type!=3">
				(合同编号 : {{ baseInfo.contract_num }})
			</template>
		</div>
		<div class="_title-wrapper">
			<span class="_span1">
				<span class="_left-text">客户姓名：</span>
				<span class="_right-text">{{ baseInfo.customer_name || '--' }}</span>
			</span>
			<span class="_span1">
				<span class="_left-text">客户手机号：</span>
				<span class="_right-text">{{ baseInfo.phone || '--' }}</span>
			</span>
			<span class="_span1">
				<span class="_left-text">退款类型：</span>
				<span class="_right-text">{{ baseInfo.refund_type_name || '--' }}</span>
			</span>
			<span class="_span1">
				<span class="_left-text">邀约人：</span>
				<span class="_right-text">{{ baseInfo.invite_staff_name || '--' }}</span>
			</span>
		</div>
		<i-tabs
			v-model="curTab"
			:style="''"
			@on-click="handleTabChange"
		>
			<i-tab-pane :index="1" label="退款信息" name="refundInfo">
				<oa-sale-refund-info 
					v-if="tabs.refundInfo" 
					ref="refundInfo" 
					:refund-id="data.refund_id" 
					:refund-type="data.refund_type"
					:status="data.status"
				/>
			</i-tab-pane>
			<i-tab-pane v-if="data.refund_type!=3" :index="2" label="项目需求" name="projectRequest">	
				<oa-sale-project-request
					v-if="tabs.projectRequest"
					ref="projectRequest"
					:contract-id="data.contract_id"
					:data="data"
					condition="refund"
				/>		
			</i-tab-pane>
			<i-tab-pane :index="3" label="到账记录" name="paymentRecord">
				<oa-payment-record v-if="tabs.paymentRecord" :contract-company-id="data.contract_company_id"/>
			</i-tab-pane>
		</i-tabs>
		<div v-if="data.show_footer && data.status !==2" class="_footer">
			<template v-if="data.status==1">
				<i-button
					v-if="!data.is_again && getAuth(isOwn,461,466)"
					@click="handleEdit"
				>
					编辑退款
				</i-button>
				<i-button
					v-if="getAuth(isOwn,724,725)"
					@click="handleDrawBack"
				>
					取消申请
				</i-button>


			</template>
			<template v-if="data.status==3 || data.status==4">
				<i-button
					v-if="!data.is_again && getAuth(isOwn,461,466) && data.refund_type==3"
					@click="handleReadd"
				>
					重新申请
				</i-button>
				<i-button
					v-if="getAuth(isOwn,724,725)"
					@click="handleDelete"
				>
					删除
				</i-button>

			</template>
			
		</div>
		<!-- <oa-sale-customer-left-refund-detail v-if="data.refund_type ==3" :data="data" :handle-ok="handleOk"/>
		<oa-sale-customer-contract-refund-detail v-else :data="data" :handle-ok="handleOk"/> -->、


	</i-drawer>
</template>
<script >
import { Drawer, TabPane, Tabs, Button } from "iview";
import { CreatePortal } from "wya-vc";
import orderModal from '@extends/mixins/orderModal';
import Item from '@components/sale/customer-deal-refund/item';
import RefundInfo from './parts/refund-info';
import PaymentRecord from './parts/payment-record';
import { getAuth } from '../../../util';
import ProjectRequest from '../contract-detail/parts/project-request';




// import ContractRefundDetail from './refund-contract-detail';
// import LeftRefundDetail from './refund-left-detail';

export default {
	name: "oa-sale-refund-detail-1",
	components: {
		"i-drawer": Drawer,
		"i-tabs": Tabs,
		"i-tab-pane": TabPane,
		'i-button': Button,
		'oa-sale-refund-info': RefundInfo,
		'oa-payment-record': PaymentRecord,
		'oa-sale-project-request': ProjectRequest
		// 'oa-sale-customer-contract-refund-detail': ContractRefundDetail,
		// 'oa-sale-customer-left-refund-detail': LeftRefundDetail
	},
	mixins: [orderModal],
	props: {
		data: Object // data.refund_type 1 产品退款 ， 2 换产品退款 ， 3 余额退款
	},
	data() {
		return {
			curTab: 'refundInfo',
			tabs: {
				refundInfo: true,
				projectRequest: false,
				paymentRecord: false,
				
			},
			baseInfo: {
				customer_name: "", // 客户姓名
				phone: "",
				contract_company_name: "", // 合同公司名称
				our_company_id: null,
				refund_type: null, // 退款类型  1 合同退款 2 合同换产品退款 3 余额退款
				refund_type_name: "", // 退款类型
				invite_staff_id: null,
				invite_staff_name: "", // 邀约人
				contract_amount: "", // 合同金额 根据退款类型判断 refund_type=3没有下面的字段
				last_amount: "", // 剩余尾款
				need_amount: "", // 合同应付金额
				payment_amount: "", // 合同实付金额
				total_cost_amount: "", // 合同总成本
				total_service_amount: "", // 总服务提成
				commission_performance: "", // 提成业绩
				staff_id: null,
				staff_name: "", // 下单人
				negotiator: "", // 谈判人 多个，分割的
				create_time: "" // 下单时间
			},
			visible: false
		};
	},
	computed: {
		isOwn() {
			return this.data.is_own;
		},
		type() {
			return this.data.type;
		}
	},
	watch: {
		'data.refund_id': function (v1, v2) {
			if (this.curTab == 'projectRequest' && this.data.refund_type == 3) {
				this.curTab == 'refundInfo';
			}
			Object.keys(this.tabs).forEach(key => {
				this.tabs[key] = (key == this.curTab);
			});
			this.loadRefundDetail();
		},
	},
	beforeCreate() {
		this.getAuth = getAuth;
	},
	mounted() {
		this.visible = true;
		this.loadRefundDetail();
	},
	methods: {
		handleOk() {
			this.visible = false;
			this.$emit("sure");
		},
		handleCancel() {
			this.visible = false;
			this.$emit("close");
		},
		handleTabChange(val) {
			this.tabs[val] = true;
		},
		initTabs() {
			this.tabs = {
				refundInfo: true,
				contractInfo: false,
				projectRequest: false
			};

		},
		loadRefundDetail() {
			this.$request({
				url: "_SAEL_REFUND_DETAIL_GET",
				type: "GET",
				param: { refund_id: this.data.refund_id },
				loading: false,
			}).then(res => {
				this.baseInfo = res.data.base_info;
			}).catch((res) => {
				console.error(res);
				this.$Message.error(res.msg);
			});
		},
		handlePass() {
			Item.methods.handlePass.call(this, this.data).then((res) => res && this.handleOk());
		},
		handleEdit() {
			Item.methods.popupDetail.call(this, this.data, '编辑退款', 'update').then((res) => {
				if (res.has_audit) {
					this.handleCancel();
				} else if (res.has_update) {
					this.loadRefundDetail();
					this.$refs.refundInfo && this.$refs.refundInfo.loadData();
				}
			});
		},
		handleDrawBack() {
			Item.methods.handleDrawBack.call(this, this.data).then((res) => res && this.handleOk());
		},
		handleRefuse() {
			Item.methods.handleRefuse.call(this, this.data).then((res) => res && this.handleOk());
		},
		handleReadd() {
			Item.methods.popupDetail.call(this, this.data, '重新申请', 'readd');
		},
		handleDelete() {
			Item.methods.handleDelete.call(this, this.data).then(res => res && this.handleOk());
		},
		handleResetCur() {
			this.$store.commit("SALE_CUSTOMER_DEAL_REFUND_LIST_RESET", {
				type: this.$route.query.type
			});
		},
	}
};
export const RefundDetail = CreatePortal({ alive: true }, module.exports.default);
</script>
<style lang="scss">
</style>