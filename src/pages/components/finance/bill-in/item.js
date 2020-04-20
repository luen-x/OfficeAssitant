import { Tooltip } from 'iview';
import Explain from '@components/_common/explain/explain';

export default {
	data() {
		return {
			columns: [
				{
					title: '公司名称',
					key: 'contract_company_name',
					fixed: 'left',
					minWidth: 240,
					render: (h, params) => {
						const { contract_company_name } = params.row;
						return (
							<div>
								{
									contract_company_name.length > 15 ? <Tooltip
										content={contract_company_name}
										max-width={240}
										transfer={true}
									>
										{ contract_company_name.substr(0, 15) + '...' }
									</Tooltip> 
										: <span>{ contract_company_name }</span>
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
					title: '付款时间',
					minWidth: 200,
					key: 'payment_time',
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
					}
				},
				{
					title: '到账金额',
					minWidth: 120,
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
					}
				},
				{
					title: '付款方式',
					minWidth: 150,
					key: 'method_name',
				},
				{
					title: '入账账户',
					minWidth: 200,
					key: 'item_name',
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
				}
			],
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('FINANCE_CUSTOMER_ACHI_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('FINANCE_CUSTOMER_ACHI_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
	}
};

