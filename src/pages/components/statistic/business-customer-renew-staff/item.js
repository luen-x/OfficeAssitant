import AutoTooltip from '@common/auto-tooltip/auto-tooltip';

export default {
	data() {
		const columns = [
			{
				title: '公司名称',
				key: 'contract_company_name',
				minWidth: 100,
				render: (h, { row }) => {
					return <AutoTooltip 
						content={row.contract_company_name} 
						theme="dark" placement="bottom" 
						labelClass={this.$auth[1792] ? 'g-operation' : " "} 
						onClickLabel={() => this.$auth[1792] && this.handleToDealCUstomer(row)} 
					/>;
				}
			},
			{
				title: '行业',
				key: 'industry_name',
				minWidth: 120,
				
			},
			{
				title: '地区',
				key: 'address',
				minWidth: 120,
				
			},
			{
				title: '个人/公司客户',
				key: 'company_type_name',
				minWidth: 120,
			}, 
			{
				title: '续费总额',
				key: 'renew_amount_total',
				minWidth: 120,
				sortable: "custom",
				
			}
			
		];
		this.setColumnSortType(columns);
		return {
			columns,
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('STATISTIC_BUSINESS_CUSTOMER_RENEW_STAFF_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('STATISTIC_BUSINESS_CUSTOMER_RENEW_STAFF_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
		handleToDealCUstomer(row) {
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

