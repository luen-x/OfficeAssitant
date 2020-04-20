import { Tooltip } from 'iview';

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
					key: 'mobile',
				},
				{
					title: '成交月份',
					minWidth: 200,
					key: 'deal_month',
				},
				{
					title: '退款时间',
					minWidth: 200,
					key: 'refund_time',
				},
				{
					title: '退款金额',
					minWidth: 120,
					key: 'refund_amount',
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

