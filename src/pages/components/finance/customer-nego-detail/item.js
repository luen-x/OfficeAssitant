import { Tooltip } from 'iview';
import Explain from '@components/_common/explain/explain';
import { FinanceDetail } from '../_common';
import { DetailDrawer } from '../customer-achi/popup/detail';
import { DetailDrawer as BallotDrawer } from '../ballot/popup/detail';


const customerTabs = [
	{
		title: '合同编号',
		minWidth: 240,
		fixed: 'left',
		key: 'opt',
		render: (h, params) => {
			const { contract_num, contract_company_name, contract_id } = params.row;
			return h('span', {
				class: 'g-operation',
				attrs: {
					title: contract_company_name
				},
			}, contract_num);
		}
	},
	{
		title: '下单产品',
		minWidth: 200,
		render: (h, params) => {
			const { project = [] } = params.row;
			let product = "";
			project.forEach((item, index) => {
				product += item.product_name;
				if (index !== project.length - 1) {
					product += '+';
				}
			});
			return (
				<div>
					{
						product.length > 14 ? <Tooltip 
							transfer
							max-width={200}
							content={product}>
							{ product.substr(0, 13) }
						</Tooltip> : <div>{product}</div>
					}
				</div>
			);
		}
	},
	{
		title: '客户姓名',
		minWidth: 120,
		key: 'customer_name',
	},
	{
		title: '客户手机号',
		minWidth: 120,
		key: 'phone',
	},
	{
		title: '应付金额',
		minWidth: 120,
		key: 'need_amount',
		renderHeader: (h, params) => {
			return (
				<div class="g-c-black2" style={{ fontWeight: 400 }}>
					应付金额
					<Explain 
						style={{ marginLeft: '2px' }}
						title="客户应该付款的金额"
						content="如：微商系统合同的标准金额是13.98万，销售给客户优惠后的价格是10万，优惠后的金额即应付金额，即应付金额是10万"
					/>
				</div>
			);
		},
	},
	{
		title: '实付金额',
		minWidth: 120,
		key: 'payment_amount',
		renderHeader: (h, params) => {
			return (
				<div class="g-c-black2" style={{ fontWeight: 400 }}>
					实付金额
					<Explain 
						style={{ marginLeft: '2px' }}
						title="客户实际支付的金额"
						content="举例：客户想购买产品A，通过谈判最后确定的价格为10万，客户打款的10万为实付金额"
					/>
				</div>
			);
		},
	},
	{
		title: '剩余尾款',
		minWidth: 120,
		key: 'last_amount',
		renderHeader: (h, params) => {
			return (
				<div class="g-c-black2" style={{ fontWeight: 400 }}>
					剩余尾款
					<Explain 
						style={{ marginLeft: '2px' }}
						title="客户合作后还未付清的费用"
						content="假如产品A需要10万，客户下单支付8万，则剩余尾款为2万"
					/>
				</div>
			);
		},
	},
	{
		title: '扣除成本',
		minWidth: 120,
		key: 'total_cost_amount',
		renderHeader: (h, params) => {
			return (
				<div class="g-c-black2" style={{ fontWeight: 400 }}>
					扣除成本
					<Explain 
						style={{ marginLeft: '2px' }}
						title="扣除的产品成本"
						content="如微商系统是10万，成本为10%，则扣除成本是1万"
					/>
				</div>
			);
		},
	},
	{
		title: '提成业绩',
		minWidth: 120,
		key: 'commission_performance',
		renderHeader: (h, params) => {
			return (
				<div class="g-c-black2" style={{ fontWeight: 400 }}>
					提成业绩
					<Explain 
						style={{ marginLeft: '2px' }}
						title="当月可以算提成的业绩"
						content="如：销售下单的所有产品的实付金额为11万，产品的总共成本是1万，则当月的提成业绩是10万"
					/>
				</div>
			);
		},
	},
	{
		title: '服务提成',
		minWidth: 120,
		key: 'service_amount',
	},
	{
		title: '合同类型',
		minWidth: 120,
		key: 'contract_type_name',
	},
	{
		title: '邀约人',
		minWidth: 120,
		key: 'invite_staff_name',
	},
	{
		title: '部门',
		minWidth: 120,
		key: 'invite_depart_name',
	},
	{
		title: '下单人',
		minWidth: 120,
		key: 'staff_name',
	},
	{
		title: '下单时间',
		minWidth: 200,
		key: 'create_time',
	}
];
const refundTabs = [
	{
		title: '退款金额',
		minWidth: 200,
		key: 'opt',
		render: (h, params) => {
			const { refund_amount, contract_id, refund_type, refund_id } = params.row;
			return h('span', {
				class: 'g-operation g-oneline',
			}, refund_amount);
		}
	},
	{
		title: '提成扣除月份',
		minWidth: 120,
		key: 'minus_month',
	},
	{
		title: '退款类型',
		minWidth: 100,
		key: 'refund_type_name',
	},
	{
		title: '邀约人',
		minWidth: 100,
		key: 'invite_staff_name',
	},
	{
		title: '部门',
		minWidth: 100,
		key: 'invite_depart_name',
	},
	{
		title: '申请人',
		minWidth: 100,
		key: 'staff_name',
	},
	{
		title: '申请时间',
		minWidth: 200,
		key: 'create_time',
	}
];
const achiTabs = [
	{
		title: '实付金额',
		minWidth: 200,
		key: 'opt',
		renderHeader: (h, params) => {
			return (
				<div class="g-c-black2" style={{ fontWeight: 400 }}>
					实付金额
					<Explain 
						style={{ marginLeft: '2px' }}
						title="客户实际支付的金额"
						content="举例：客户想购买产品A，通过谈判最后确定的价格为10万，客户打款的10万为实付金额"
					/>
				</div>
			);
		},
		render: (h, params) => {
			const { payment_amount, payment_id, contract_company_name } = params.row;
			return h('span', {
				class: 'g-operation g-oneline',
				attrs: {
					title: contract_company_name
				},
			}, payment_amount);
		}
	},
	{
		title: '成交月份',
		minWidth: 150,
		key: 'deal_month',
	},
	{
		title: '分单后业绩',
		minWidth: 150,
		key: 'after_share_performance',
		renderHeader: (h, params) => {
			return (
				<div class="g-c-black2" style={{ fontWeight: 400 }}>
					分单后业绩
					<Explain 
						style={{ marginLeft: '2px' }}
						title="销售分单之后的业绩"
						content="如：我是销售A，业绩是1万，分了10%给了销售B，即分了1000给了B，则我的分单业绩是9000"
					/>
				</div>
			);
		},
	},
	{
		title: '到账金额',
		minWidth: 100,
		key: 'received_amount',
		renderHeader: (h, params) => {
			return (
				<div class="g-c-black2" style={{ fontWeight: 400 }}>
					到账金额
					<Explain 
						style={{ marginLeft: '2px' }}
						content="扣除手续费后实际到账的金额，用以计算业绩提成"
					/>
				</div>
			);
		},
	},
	{
		title: '手续费',
		minWidth: 100,
		key: 'poundage',
		renderHeader: (h, params) => {
			return (
				<div class="g-c-black2" style={{ fontWeight: 400 }}>
					手续费
					<Explain 
						style={{ marginLeft: '2px' }}
						title="客户付款过程中因缴款方式不同被第三方扣除的费用"
						content="如：购买微商系统通过刷卡付款，产生的被银行扣除的100元，则手续费是100元"
					/>
				</div>
			);
		},
	},
	{
		title: '收款公司',
		minWidth: 240,
		key: 'received_company_name',
	},
	{
		title: '录入人',
		minWidth: 100,
		key: 'staff_name',
	},
	{
		title: '录入时间',
		minWidth: 200,
		key: 'create_time',
	}
];
const ticketTabs = [
	{
		title: '发票抬头',
		minWidth: 200,
		key: 'invoice_title',
		render: (h, { row }) => {
			return (
				<span class="g-operation">{row.invoice_title}</span>
			);
		}
	},
	{
		title: '申请人',
		minWidth: 100,
		key: 'staff_name',
	},
	{
		title: '申请时间',
		minWidth: 180,
		key: 'create_date',
	},
	{
		title: '开票时间',
		minWidth: 180,
		key: 'invoice_time',
	},
	{
		title: '发票类型',
		minWidth: 150,
		key: 'invoice_name',
	},
	{
		title: '发票代码',
		minWidth: 150,
		key: 'invoice_code',
	},
	{
		title: '发票号码',
		minWidth: 150,
		key: 'invoice_num',
	},
	{
		title: '金额',
		minWidth: 100,
		key: 'amount',
	},
	{
		title: '税额',
		minWidth: 100,
		key: 'tax_amount',
	},
	{
		title: '总金额',
		minWidth: 100,
		key: 'total_amount',
	}
];
export default {
	computed: {
		getColumns() {
			switch (this.type) {
				case '1':
					return achiTabs;
				case '2':
					return customerTabs;
				case '3':
					return refundTabs;
				case '4':
					return ticketTabs;
				default:
					break;
			}
		}
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('FINANCE_CUSTOMER_NEGO_DETAIL_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('FINANCE_CUSTOMER_NEGO_DETAIL_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
		handleOpenRefund(row) {
			const { 
				contract_company_name,
				contract_num, 
				refund_id, 
				contract_id, 
				refund_type,
				contract_company_id,
				refund_amount
			} = row;		
			FinanceDetail.popup({
				name: 'refund',
				refund_id,
				contract_id,
				refund_type,
				contract_company_name,
				contract_company_id,
				contract_num,
				detail_info: {
					refund_amount: Number(refund_amount)
				}
			}).then(res => {
				this.$refs.tableTarget[Number(this.type) - 1].$refs.tableTarget.clearCurrentRow();
			}).catch(err => {
				this.$refs.tableTarget[Number(this.type) - 1].$refs.tableTarget.clearCurrentRow();
			});
		},
		handleOpenCustomer(row) {
			const { contract_num, contract_company_name, contract_id, contract_company_id, contract_type, project } = row;			
			FinanceDetail.popup({
				name: 'contract',
				type: '2',
				project,
				contract_company_name,
				contract_company_id,
				contract_num,
				contract_id,
				contract_type
			}).then(res => {
				this.$refs.tableTarget[Number(this.type) - 1].$refs.tableTarget.clearCurrentRow();
			}).catch(err => {
				this.$refs.tableTarget[Number(this.type) - 1].$refs.tableTarget.clearCurrentRow();
			});
		},
		handleOpenBallot(row) {
			const { invoice_id } = row;
			BallotDrawer.popup({
				invoice_id,
				type: '3',
				isDeal: true
			}).then(res => {
				this.$refs.tableTarget[Number(this.type) - 1].$refs.tableTarget.clearCurrentRow();
			}).catch(err => {
				this.$refs.tableTarget[Number(this.type) - 1].$refs.tableTarget.clearCurrentRow();
			});
		},
		handleOpenAchi(row) {
			const { payment_amount, contract_id, payment_id, contract_company_name, contract_company_id, customer_id } = row;			
			FinanceDetail.popup({
				payment_id,
				name: 'payment',
				contract_company_id,
				customer_id,
				type: '2',
				contract_id,
				contract_company_name
			}).then(res => {
				this.$refs.tableTarget[Number(this.type) - 1].$refs.tableTarget.clearCurrentRow();
			}).catch(err => {
				this.$refs.tableTarget[Number(this.type) - 1].$refs.tableTarget.clearCurrentRow();
			});
		},
		handleOpenDrawer(row) {
			const tabOpenObj = {
				'1': () => this.handleOpenAchi(row),
				'2': () => this.handleOpenCustomer(row),
				'3': () => this.handleOpenRefund(row),
				'4': () => this.handleOpenBallot(row)
			};
			const openFn = tabOpenObj[this.type];
			openFn();
		}
	}
};

