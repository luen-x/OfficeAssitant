import AutoTooltip from '@common/auto-tooltip/auto-tooltip';

export default {
	data() {
		return {
			columns: [
				{
					title: '公司名称',
					key: 'contract_company_name',
					minWidth: 150,
					render: (h, { row }) => {
						return <AutoTooltip 
							content={row.contract_company_name} 
							theme="dark" 
							placement="bottom" 
							onClick-label={() => this.handleLink(row)}
						 />; 
					}
				},
				{
					title: '邀约人',
					key: 'staff_name',
					minWidth: 100
				},
				{
					title: '合同编号',
					key: 'contract_num',
					minWidth: 100
				},
				{
					title: '个人/公司客户',
					key: 'company_type',
					minWidth: 100
				},
				{
					title: '折扣',
					key: 'rate',
					minWidth: 100
				}
					
				
			],
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('STATISTIC_BUSINESS_CUSTOMER_DEAL_DISCOUNT_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('STATISTIC_BUSINESS_CUSTOMER_DEAL_DISCOUNT_LIST_RESET', { type: this.type });
		},
		handleLink(row) {
			if (!this.$auth[410]) {
				this.$Message.error('暂无查看权限');
				return;
			}
			this.$router.push({
				path: '/sale/customer/deal/deal/detail',
				query: {
					contract_company_id: row.contract_company_id,
				}
			});
		}
	}
};

