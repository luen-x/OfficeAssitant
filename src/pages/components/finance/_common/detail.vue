<template>
	<div>
		<i-drawer
			v-model="closable"
			:mask="false"
			:mask-closable="false"
			class="v-finance-drawer"
			@on-close="$emit('close')"
		>
			<div 
				v-if="name === 'payment'"
				slot="header" 
				class="_detail-header">{{ contract_company_name }}</div>
			<oa-detail-head 
				v-else
				slot="header"
				:name="name" 
				:datas="data"
				:refund-type="refund_type"
				:type="type"/>
			<oa-detail-content
				:style="{marginBottom: type == 1 ? '60px' : '0px'}" 
				:name="name" 
				:contract-id="contract_id" 
				:refund-type="refund_type"
				:customer-id="customer_id"
				:discount-id="discount_id"
				:company-id="contract_company_id"
				:refund-id="refund_id" 
				:payment-id="payment_id"
				:supply-id="supply_id"
				:data-info="data"
				:electronic-id="electronic_id"
				:contract-type="contract_type"
				:type="type"/>
			<div v-if="footShow" class="_fixed-height"/>
			<div v-if="footShow" class="_drawer-footer g-flex g-flex-ac">
				<template v-if="type === '1'">
					<div v-if="name === 'payment'">
						<i-button v-if="$auth['93']" style="margin-right: 8px;height:32px" type="primary" @click="handleOpenModal('1')">通过</i-button>
						<i-button v-if="$auth['94']" style="margin-right: 8px;height:32px" @click="handleOpenModal('2')">驳回</i-button>
						<i-button 
							v-if="$auth['1486']" 
							style="margin-right: 8px;height:32px" 
							@click="handleEdit">重新编辑</i-button>
					</div>
					<div v-else-if="name=='supplement'">
						<i-button v-if="$auth[814]" style="margin-right: 8px" type="primary" @click="handleOpenModal('1')">通过申请</i-button>
						<i-button v-if="$auth[815]" style="margin-right: 8px" @click="handleOpenModal('2')">驳回申请</i-button>
						<i-button 
							v-if="$auth[817]" 
							@click="handleOpenRemain"
						>
							更改到账
						</i-button>
					</div>
					<div v-else-if="name=='refund'">
						<i-button v-if="getAuth[0]" style="margin-right: 8px" type="primary" @click="handlePassRefund">通过申请</i-button>
						<i-button v-if="getAuth[1]" style="margin-right: 8px" @click="handleRejectRefund">驳回申请</i-button>
					</div>
					<div v-else>
						<!-- <i-button v-if="getAuth[0]" style="margin-right: 8px" type="primary" @click="handleOpenModal('1')">通过申请</i-button> -->
						<i-button 
							v-if="getAuth[0] && name === 'contract'" 
							style="margin-right: 8px" 
							type="primary" 
							@click="handlePassContract"
						>
							通过申请
						</i-button>
						<i-button v-else-if="getAuth[0]" style="margin-right: 8px" type="primary" @click="handleOpenModal('1')">通过申请</i-button>
						<i-button v-if="getAuth[1]" style="margin-right: 8px" @click="handleOpenModal('2')">驳回申请</i-button>
						<i-button 
							v-if="(name === 'contract') && $auth['98']" 
							style="margin-right: 8px" 
							@click="handleOpenChange">修改成本</i-button>
						<i-button 
							v-if="remainAuth"
							style="margin-right: 8px"  
							@click="handleOpenRemain">更改到账</i-button>	
					</div>
				</template>
				<template>
					<i-button 
						v-if="(name === 'contract') && $auth['1016']" 
						style="margin-right: 8px" 
						@click="handleOpenModify">更改下单信息</i-button>	
					<i-button 
						v-if="(name === 'contract') && $auth['98'] && type === '2' && !is_supply" 
						style="margin-right: 8px" 
						@click="handleOpenChange">修改成本</i-button>
				</template>
			</div>
		</i-drawer>
	</div>
</template>

<script>
import { Drawer, Row, Col, Button, Tabs, TabPane } from 'iview';
import { CreatePortal } from 'wya-vc';
import API_ROOT from '@stores/apis/root';
import { getParseUrl, getHashUrl, formatMoment, getItem } from '@utils/utils';
import { Confirm } from '@common/confirm/confirm';
import DetailItem from './detail-item';
import { AchiAuditModal } from '../customer-achi/popup/audit';
import { ContractAuditModal } from '../customer-supplement/popup/audit'; 
import { auditReject, auditPass } from '../customer-refund/popup/audit';
import DetailHead from './detail-head/detail-head';
import DetailContent from './detail-content/detail-content';
import { ChangeModal } from '../customer-contract/popup/change';
import { RemainModal } from './popup/remain';
import { ModifyCusInformationModal } from './popup/cus-info-modify';

export default {
	name: 'finance-detail-drawer',
	components: {
		'i-drawer': Drawer,
		'i-button': Button,
		'oa-detail-item': DetailItem,
		'oa-detail-head': DetailHead,
		'oa-detail-content': DetailContent,
	},
	props: {
		type: String,
		name: String,
		contract_id: Number,
		refund_id: Number,
		customer_id: Number,
		project: Array,
		refund_type: Number,
		deal_status: Number,
		contract_company_id: Number,
		contract_company_name: String,
		contract_num: String,
		need_amount: String,
		electronic_id: Number,
		discount_id: Number,
		payment_id: Number,
		supply_id: Number,
		is_supply: Number,
		contract_type: Number,
		deal_month: String,
		detail_info: {
			type: Object,
			default: () => ({})
		}
	},
	data() {
		return {
			closable: false,
			data: {},
		};
	},
	computed: {
		getAuth() {
			let authArr = [true, true];
			switch (this.name) {
				case 'refund':
					authArr = [this.$auth['101'], this.$auth['102']];
					break;
				case 'contract':
					authArr = [this.$auth['96'], this.$auth['97']];
					break;
				case 'elec':
					authArr = [this.$auth['99'], this.$auth['100']];
					break;
				case 'discount':
					authArr = [this.$auth['1488'], this.$auth['1489']];
					break;
				default:
					break;
			}
			return authArr;
		},
		footShow() {
			return this.type === '1' || (this.type === '2' && ['contract'].includes(this.name));
		},
		remainAuth() {
			if (this.name === 'contract') {
				if (this.$auth['726'] && this.need_amount != 0) {
					return true;
				} else {
					return false;
				}
			} else if (this.name === 'supplement') {
				return this.$auth['817'];
			} else {
				return false;
			}
		}
	},
	watch: {
		refund_id() {
			this.name === 'refund' && this.loadRefundData();
		},
		contract_id() {
			['contract', 'supplement', 'elec', 'discount'].includes(this.name) && this.loadCustomerData();
		}
	},
	mounted() {
		this.closable = true;
		['contract', 'supplement', 'elec', 'discount'].includes(this.name) && this.loadCustomerData();
		this.name === 'refund' && this.loadRefundData();
	},
	methods: {
		handleOk() {
			this.closable = false;
			this.$emit('sure');
		},
		handleCancel() {
			this.closable = false;
			this.$emit('close');
		},
		handleOpenModify() {
			ModifyCusInformationModal.popup({
				contract_id: this.contract_id,
				type: this.type
			}).then(res => {
				this.loadData();
				this.$store.commit('FINANCE_CUSTOMER_CONTRACT_LIST_INIT');
			}).catch(err => {

			});
		},
		loadCustomerData() {
			const url = '_FINANCE_CUSTOMER_CONTRACT_INFO_GET';
			this.$request({
				url: API_ROOT[url],
				type: 'GET',
				param: {
					contract_id: this.contract_id,
				},
				loading: false
			}).then(res => {
				this.data = res.data;
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		loadRefundData() {
			const url = '_FINANCE_CUSTOMER_REFUND_INFO_GET';
			this.$request({
				url: API_ROOT[url],
				type: 'GET',
				param: {
					refund_id: this.refund_id
				},
				loading: false
			}).then(res => {
				this.data = res.data.base_info;
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		getAuditModal() {
			return {
				// "refund": RefundAuditModal,
				"contract": ContractAuditModal,
				"supplement": ContractAuditModal,
				"payment": AchiAuditModal,
				'elec': AchiAuditModal,
				'discount': AchiAuditModal
			};
		},
		handleOpenModal(name) {
			const { is_charge } = this.$global.staff;
			const obj = this.getAuditModal();
			
			obj[this.name].popup({
				name,
				show: this.name === 'payment',
				refund_type: this.refund_type,
				payment_id: this.payment_id,
				refund_id: this.refund_id,
				contract_id: this.contract_id,
				contract_company_id: this.contract_company_id,
				supply_id: this.supply_id,
				label: this.name !== 'payment' ? '提成归属月份' : '业绩归属月份',
				detail_info: this.detail_info,
				deal_month: this.deal_month,
				requestFn: (res) => this.handleAuditRequest({
					...res,
					data: {
						...res.data,
						status: name, // 兼容销售审核
						audit_remark: res.data.remarks, // 兼容销售审核

						contract_id: this.contract_id,
						refund_id: this.refund_id,
						supply_id: this.supply_id,
						electronic_id: this.electronic_id,
						discount_id: this.discount_id,
						type: name,
						payment_id: this.payment_id
					}
				})
			}).then(res => {
				
			});
		},
		handleChangeRequest(res) {
			this.$request({
				url: API_ROOT._FINANCE_CUSTOMER_CONTRACT_EDIT_COST_POST,
				type: 'POST',
				param: res.data
			}).then(suc => {
				this.$store.commit('FINANCE_CUSTOMER_CONTRACT_LIST_INIT');
				this.$Message.success(suc.msg);
				this.$emit('sure');
				res.cb();
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleAuditRequest(res) {
			const param = this.getParam();
			this.$request({
				url: API_ROOT[param.url],
				type: 'POST',
				param: res.data
			}).then(suc => {
				this.$store.commit(param.commit);
				this.$Message.success(suc.msg);
				this.$emit('sure');
				res.cb();
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleOpenChange() {
			ChangeModal.popup({
				project: this.project,
				contract_id: this.contract_id,
				requestFn: (res) => this.handleChangeRequest({
					...res,
					data: {
						...res.data,
						contract_id: this.contract_id
					}
				})
			}).then(res => {
			});
		},
		handleOpenRemain() {
			RemainModal.popup({
				contract_id: this.contract_id,
				contract_company_id: this.contract_company_id,
				supply_id: this.supply_id
			}).then(res => {
				this.$vc.emit('remain-refresh');
				this.name === 'contract' && this.$store.commit('FINANCE_CUSTOMER_CONTRACT_LIST_INIT');
				this.name === 'supplement' && this.$store.commit('FINANCE_CUSTOMER_SUPPLEMENT_LIST_INIT');
			}).catch(err => {

			});
		},
		handleEdit() {
			this.$router.push(getHashUrl('/finance/customer/achi/edit', {
				deal_status: this.deal_status,
				payment_id: this.payment_id,
				contract_company_id: this.contract_company_id,
				mode: 'finance',
				action: 'update'
			}));
		},
		getParam() {
			switch (this.name) {
				case 'refund':
					return {
						url: "_FINANCE_CUSTOMER_REFUND_MONEY_AUDIT_POST",
						commit: "FINANCE_CUSTOMER_REFUND_LIST_INIT"
					};
				case 'contract':
					return {
						url: '_FINANCE_CUSTOMER_CONTRACT_AUDIT_POST',
						commit: 'FINANCE_CUSTOMER_CONTRACT_LIST_INIT'
					};
				case 'elec': 
					return {
						url: '_FINANCE_CUSTOMER_ELEC_AUDIT_POST',
						commit: 'FINANCE_CUSTOMER_ELEC_LIST_INIT'
					};
				case 'discount': 
					return {
						url: '_FINANCE_CUSTOMER_DISCOUNT_AUDIT_POST',
						commit: 'FINANCE_CUSTOMER_DISCOUNT_LIST_INIT'
					};
				case 'payment':
					return {
						url: '_FINANCE_CUSTOMER_ACHI_AUDIT_POST',
						commit: 'FINANCE_CUSTOMER_ACHI_LIST_INIT'
					};
				case 'supplement':
					return {
						url: '_FINANCE_CUSTOMER_CONTRACT_AUDIT_POST',
						commit: 'FINANCE_CUSTOMER_SUPPLEMENT_LIST_INIT'
					};
				default:
					break;
			}
		},
		async handlePassContract() {

			 const res = await this.$request({
				url: "_DINANCE_CONTRACT_PASS_CHECK_GET",
				type: "GET",
				param: {
					contract_id: this.contract_id,
				},
				loading: false,
			}).catch(i => i);
			if (res && res.status && res.data.check_result) {
				await Confirm.popup({
					title: "温馨提示",
					msg: '该客户之前有下单过【大课培训+咨询】，请确认是否需要将之前扣除的成本划分到系统产品成本内，请线下及时处理，以免忘记或成本统计错误。',
					cancelText: '',
					okText: '我知道了'
				}).catch(err => err && console.error(err));
			}
			this.handleOpenModal('1');
		},
		handlePassRefund() {
			// <!--  1 产品退款 ， 2 换产品退款 ， 3 余额退款 -->
			const { refund_type: refundType, refund_id: refundId, contract_id: contractId } = this;
			auditPass({ refundType, refundId, contractId }).then(() => {
				this.$store.commit(this.getParam().commit);
				this.handleOk();
			}).catch(err => err && console.error(err));
		},
		handleRejectRefund() {
			auditReject(this.refund_id)
				.then(() => {
					this.$store.commit(this.getParam().commit);
					this.handleOk(); 
				})
				.catch(err => err && console.error(err));
		},
	}
};
export const FinanceDetail = CreatePortal({ store: app.$store, alive: true }, module.exports.default);
</script>

<style lang="scss">
.v-finance-drawer {
	.ivu-drawer-content {
		display: flex;
		flex-direction: column;
	}
	.ivu-drawer-header {
		display: flex;
	}
	.ivu-drawer-body {
		display: flex;
		flex: 1;
		padding: 0px;
		position: relative;

		.ivu-tabs {
			flex: 1;
			display: flex;
			flex-direction: column;
		}
		.ivu-tabs-bar {
			margin-bottom: 0;
		}
		.ivu-tabs-content {
			flex: 1;
			height: 0;
		}
		.ivu-tabs-tabpane {
			padding: 16px 20px 0;
			overflow-y: auto;
			overflow-x: hidden;
			max-height: 100%;
		}
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
		.ivu-tabs-tabpane {
			overflow-y: auto;
		}
	}

	._detail-header {
		color: #000;
		font-size: 16px;
		height: 31px;
		line-height: 31px;
	}
	._drawer-footer {
		width: 940px;
		height: 61px;
		position: fixed;
		bottom: 0;
		right: 0;
		border-top: 1px solid #e8e8e8;
		padding: 10px 16px;
		text-align: left;
		background: #fff;
		box-shadow: 0px -2px 9.9px 0.1px rgba(0, 0, 0, 0.08)
	}
	._fixed-height {
		height: 60px;
	}
	.ivu-tabs-tabpane {
		padding: 0 28px;
	}
	.vc-imgs-preview img {
		height: 72px;
		width: 72px;
		border: 1px solid #e5e6e7;
	}
}
</style>