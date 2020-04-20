<template>
	<i-drawer
		v-model="visible"
		:mask-closable="false"
		:mask="false"
		class="v-sale-customer-detail-side v-sale-customer-contract-detail"
		@on-close="handleCancel"
	>
		<div
			class="_head-title"
		>
			{{ contractDetail.contract_company_name || '--' }} (合同编号 : {{ contractDetail.contract_num || '--' }})
		</div>
		<div class="_title-wrapper">
			<span class="_span1" style="min-width: 130px;">
				<span class="_left-text">客户姓名：</span>
				<span class="_right-text">{{ contractDetail.customer_name || '--' }}</span>
			</span>
			<span class="_span1">
				<span class="_left-text">客户手机号：</span>
				<span class="_right-text">{{ contractDetail.phone || '--' }}</span>
			</span>
			<span class="_span1">
				<span class="_left-text">谈判人：</span>
				<span class="_right-text">	{{ contractDetail.negotiator || '--' }}</span>
			</span>
			<span class="_span1">
				<span class="_left-text">邀约人：</span>
				<span class="_right-text">	{{ contractDetail.invite_staff_name || '--' }}</span>
			</span>
			<span class="_span1 g-m-r-20" >
				<span class="_left-text">下单人：</span>
				<span class="_right-text">{{ contractDetail.staff_name || '--' }}</span>
			</span>
			<span class="_span1" style="width:460px;">
				<span class="_left-text">下单时间：</span>
				<span class="_right-text">{{ contractDetail.create_time || '--' }}</span>
			</span>


			<!-- <span class="_span1">
				<span class="_left-text">合同金额：</span>
				<span class="_right-text">{{ contractDetail.contract_amount || '--' }}</span>
			</span>
			<span class="_span1">
				<span class="_left-text">应付金额：</span>
				<span class="_right-text">	{{ contractDetail.need_amount || '--' }}</span>
			</span>
			<span class="_span1">
				<span class="_left-text">实付金额：</span>
				<span class="_right-text">{{ contractDetail.payment_amount || '--' }}</span>
			</span>
			<span class="_span1">
				<span class="_left-text">剩余尾款：</span>
				<span class="_right-text">	{{ contractDetail.last_amount || '--' }}</span>
			</span>
			<span class="_span1">
				<span class="_left-text">产品成本：</span>
				<span class="_right-text">	{{ contractDetail.total_need_cost_amount || '--' }}</span>
			</span>
			<span class="_span1">
				<span class="_left-text">实扣成本：</span>
				<span class="_right-text">	{{ contractDetail.total_cost_amount || '--' }}</span>
			</span>
			<span class="_span1">
				<span class="_left-text">提成业绩：</span>
				<span class="_right-text">{{ contractDetail.commission_performance || '--' }}</span>
			</span>
			<span class="_span1">
				<span class="_left-text">服务提成：</span>
				<span class="_right-text">{{ contractDetail.total_service_amount || '--' }}</span>
			</span> -->
			
			
			
			
		</div>
		<i-tabs
			:style="data.show_footer?'':'margin-bottom:0'"
			v-model="curTab"
			@on-click="handleTabChange"
		>
			<i-tab-pane :label="'审核信息'" name="auditInfo">
				<oa-sale-audit-info
					v-if="tabs.auditInfo"
					ref="auditInfo"
					:contract-id="data.contract_id"
					:data="data"
				/>
			</i-tab-pane>
			<i-tab-pane :label="'项目需求'" name="projectRequest">
				<oa-sale-project-request
					v-if="tabs.projectRequest"
					ref="projectRequest"
					:contract-id="data.contract_id"
					:show-option="!data.is_achieve && data.type ==2"
					:data="data"
				/>
			</i-tab-pane>
			<template v-if="data.contract_type !=4">
				<i-tab-pane :label="'客户信息'" name="customerInfo">
					<oa-sale-contract-customer-info
						v-if="tabs.customerInfo"
						ref="customerInfo"
						:contract-id="data.contract_id"
						:contract-type="data.contract_type"
						@change="handleCustomerInfoChange"
					/>
				</i-tab-pane>
				<i-tab-pane v-if="data.type=='2' || data.type=='4'" :label="'服务提成'" name="serviceAmount" class="g-pd-20">
					<oa-sale-service-amount 
						v-if="tabs.serviceAmount" 
						ref="serviceAmount" 
						:contract-id="data.contract_id"
						:contratc-type="data.contract_type" 
					/>
				</i-tab-pane>
				<i-tab-pane v-if="data.type=='2' || data.type=='4'" :label="'补款记录'" name="supplementRecords" class="g-pd-20">
					<oa-sale-supplement-record v-if="tabs.supplementRecords" ref="supplementRecords" :contract-id="data.contract_id"/>
				</i-tab-pane>
				<i-tab-pane :label="'其他合同'" name="otherContract">
					<oa-sale-other-contract v-if="tabs.otherContract" ref="otherContract" :contract-id="data.contract_id" style="margin-top:20px"/>
				</i-tab-pane>
				
			</template>
		</i-tabs>
		<div v-if=" data.show_footer" class="_footer">
			<template v-if="data.type=='1'">
				<i-button
					v-if="getAuth(isOwn,425,432)"
					@click="handleEdit"
				>
					重新编辑
				</i-button>
				<i-button
					v-if="getAuth(isOwn,426,433)"
					@click="handleDrawBack"
				>
					{{ operationNames[data.contract_type].cancel }}
				</i-button>
			</template>
			<template v-else-if="data.type=='2'">
				<i-button
					v-if="getAuth(isOwn,428,435) && +contractDetail.last_amount >0"
					key="handleSupply"
					:style="optionTransition? '':'transition:none'"
					@click="handleSupply"
				>
					补交尾款
				</i-button>
				<i-button
					v-if="getAuth(isOwn,427,434) && !data.has_refund"
					key="handleRefund"
					:style="optionTransition? '':'transition:none'"
					@click="handleRefund"
				>
					申请退款
				</i-button>
				<!-- <i-button
					v-if="getAuth(isOwn,713,715)"
					key="handleChange"
					:style="optionTransition? '':'transition:none'"
					@click="handleChangeProduct"

				>
					更换产品
				</i-button> -->

				<i-button
					v-if="getAuth(isOwn,695,696) && contactInfo.contact_name && contactInfo.contact_tel"
					@click="handleMidifyJoint"
				>更改对接信息
				</i-button>
				<i-button
					v-if="getAuth(isOwn,429,436)"
					@click="handleRenew"
				>
					续费
				</i-button>
			</template>
			<template v-else-if="data.type=='3'">
				<i-button
					v-if="!data.is_again && getAuth(isOwn,430,437)"
					@click="handleReadd"
				>
					{{ operationNames[data.contract_type].readd }}
				</i-button>
				<i-button
					v-if="getAuth(isOwn,722,723)"
					@click="handleDelete"
				>
					删除
				</i-button>
			</template>
			<i-button
				v-else-if="data.type=='4' && getAuth(isOwn,722,723)"
				@click="handleDelete"
			>
				删除
			</i-button>
			<i-button
				v-if="data.show_apply && $auth[1006]"
				@click="handleApplyTicket"
			>
				开票申请
			</i-button>

		</div>
	</i-drawer>
</template>

<script>
import { Modal, Icon, Drawer, TabPane, Tabs, Steps, Step, Button } from "iview";
import { CreatePortal, Fragment } from "wya-vc";
import { getHashUrl } from '@utils/utils';
import Item from '@components/sale/customer-deal-contract/item';
import orderModal from '@extends/mixins/orderModal';
import OtherContract from '@components/sc/_common/detail/other-contract/other-contract';
import { getAuth } from '../../../util';
import { ChangeContact } from '../../change-contact';
import { PayLeft } from "../../pay-left";
import { ApplyRefund } from "../../apply-refund";
import ProjectRequest from './parts/project-request';
import ContractCustomerInfo from './parts/contract-customer-info';
import ServiceAmount from './parts/service-amount';
import SupplementRecords from '../supply-detail/parts/supplement-records';
import AuditInfo from './parts/audit-info';
import '../../cus-form/style.scss';

const operationNames = {
	0: { add: '下单', cancel: "撤回下单", readd: '重新下单' },
	1: { add: '下单', cancel: "撤回下单", readd: '重新下单' },
	2: { add: '下单', cancel: "撤回下单", readd: '重新下单' },
	3: { add: '续费', cancel: "撤回续费", readd: "重新续费" },
	4: { add: "更换产品", cancel: "撤回更换", readd: "重换产品" }
};
export default {
	name: "c-sale-customer-detail",
	components: {
		"i-drawer": Drawer,
		"i-tabs": Tabs,
		"i-tab-pane": TabPane,
		'i-button': Button,
		'vc-fragment': Fragment,
		'oa-sale-project-request': ProjectRequest,
		'oa-sale-contract-customer-info': ContractCustomerInfo,
		'oa-sale-service-amount': ServiceAmount,
		'oa-sale-supplement-record': SupplementRecords,
		'oa-sale-audit-info': AuditInfo,
		'oa-sale-other-contract': OtherContract
	},
	mixins: [orderModal],
	props: {
		data: {
			type: Object,
			default: () => {
				return { contract_id: undefined, contract_num: undefined, show_footer: 1 };
			}
		}
	},
	data() {
		return {
			visible: false,
			closeBtnStyle: 'position: absolute;right: 20px;',
			activeKey: 0,
			modified: false,
			operationNames,
			tabs: {
				auditInfo: true,
				projectRequest: false,
				customerInfo: false,
				serviceAmount: false,
				supplementRecords: false,
				otherContract: false
			},
			curTab: 'auditInfo',
			contractDetail: {
				customer_name: "", // 客户姓名
				phone: "", // 客户手机号
				contract_company_name: "", // 合同公司名称
				our_company_id: null,
				contract_amount: "", // 合同金额 
				last_amount: "",
				need_amount: "", // 应付金额
				payment_amount: "", // 实付金额
				our_company_name: "", // 剩余尾款
				invite_staff_id: null, // 邀约人
				invite_staff_name: "", // 邀约人
				staff_id: 1, // 下单人
				staff_name: "", // 下单人
				negotiator: "", // 谈判人
				total_cost_amount: "", // 扣除成本
				total_service_amount: "", // 服务提成
				commission_performance: "", // 提成业绩
				create_time: "", // 下单时间
				contract_can_renew: 0,
			},
			contactInfo: {
				 contact_name: '',
				 contact_tel: ''
			},
			optionTransition: false
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
		'data.contract_id': function () {
			Object.keys(this.tabs).forEach(key => {
				this.tabs[key] = (key == this.curTab);
			});
			this.loadContractDetail();

		}
	},
	beforeCreate() {
		this.getAuth = getAuth;
	},
	created() {
		this.loadContractDetail();
	},
	mounted() {
		this.visible = true;
		setTimeout(() => {
			this.closeBtnStyle = 'position:fixed;top:68px;right:34px';
			// this.optionTransition = true;
		}, 200);
	},
	beforeDestroy() {
		this.closeBtnStyle = 'position: absolute;right: 20px;';
	},
	methods: {
		initTabs() {
			this.tabs = {
				auditInfo: true,
				projectRequest: false,
				customerInfo: false,
				serviceAmount: false,
				supplementRecords: false,
				otherContract: false
			};
		},
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
		handleCustomerInfoChange(info) {
			this.contactInfo = info;
		},
		loadContractDetail() {
			this.optionTransition = false;
			this.$request({
				url: "_SALE_CONTRACT_DETAIL_GET",
				type: "GET",
				param: { contract_id: this.data.contract_id },
				loading: false,
			}).then(res => {
				this.contractDetail = res.data;
				// 解决按钮样式闪烁
				setTimeout(() => {
					this.optionTransition = true;
				}, 100);
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},
		loadParentContract() {
			this.$request({
				url: "",
				type: "GET",
				param: {},
				loading: false,
			}).then(res => {}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},
		handleMidifyJoint() {
			ChangeContact.popup({
				data: { contract_id: this.data.contract_id, ...this.contactInfo }
			}).then(() => {
				this.$refs.customerInfo.loadData();
			}).catch(res => {
				res && console.error(res);
			});
		},
		handleRenew() {
			this.$router.push(
				getHashUrl('/sale/customer/deal/contract/order',
					{
						parent_contract_id:	this.data.contract_id,
						contract_company_id: this.data.contract_company_id,
						customer_id: this.data.customer_id,
						contract_type: 3,
						action: 'add'
					})
			);
		},
		handleDrawBack() {
			Item.methods.handleDrawBack.call(this, this.data).then((res) => res && this.handleCancel());
		},
		handleEdit() {
			Item.methods.handleEdit.call(this, this.data);
		},
		handleSupply() {
			Item.methods.handleSupply.call(this, this.data);
		},
		handleRefund() {
			Item.methods.handleRefund.call(this, this.data);
		},
		handleChangeProduct(row) {
			Item.methods.handleChangeProduct.call(this, this.data);
			// ApplyRefund.popup({
			// 	data: {
			// 		title: "更换产品",
			// 		action: 'add',
			// 		contract_company_id: row.contract_company_id,
			// 		contract_id: row.contract_id,
			// 		refund_type: 2,
			// 		projects: row.project
			// 	}
			// }).then(() => {
			// 	// this.handleResetCur();
			// }).catch(res => { });

		},
		handleReadd() {
			Item.methods.handleReadd.call(this, this.data);
		},
		handleDelete() {
			Item.methods.handleDelete.call(this, this.data).then(res => res && this.handleOk());
		},
		handleResetCur() {
			const path = this.$route.path;
			if (path == "/sale/customer/deal/contract") {
				this.$store.commit("SALE_CUSTOMER_DEAL_CONTRACT_LIST_RESET", {
					type: this.$route.query.type
				});
			} else if (path == "/sale/customer/deal/deal/detail") {
				this.$store.commit("SALE_CUSTOMER_DEAL_DEAL_DETAIL_LIST2_RESET", {
					type: this.$route.query.type
				});
			}
		},
		handleApplyTicket(row) {
			this.$router.push({ path: '/sale/ticket/apply', query: { ...this.data, type: 'sale', } });
		}
	},
};

export const ContractDetail = CreatePortal({
	alive: true
}, module.exports.default);
</script>
<style lang="scss">
.v-sale-customer-contract-detail {
	.v-sc-other-contract {
			._other-contract {
				width: 100%
			}

		}

}

</style>
