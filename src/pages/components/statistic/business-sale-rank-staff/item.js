export default {
	data() {
		return {
			columns: [
				{
					title: '公司名称',
					key: 'company_name',
					minWidth: 220,
					render: (h, { row }) => {
						if (this.$auth[410]) {
							return (
								<div class="g-operation" onClick={() => {
									this.$router.push({
										path: '/sale/customer/deal/deal/detail',
										query: {
											contract_company_id: row.contract_company_id
										}
									});
								}}>
									{ row.company_name }
								</div>
							);
						} else {
							return (
								<div>{ row.company_name }</div>
							);
						}
					}
				},
				{
					title: '行业',
					key: 'industry_name',
					minWidth: 160
				},
				{
					title: '地区',
					key: 'region',
					minWidth: 160
				},
				{
					title: '客户产品',
					key: 'product_name',
					minWidth: 160
				},
				{
					title: '成交金额',
					key: 'pay_performance',
					minWidth: 160
				},
				{
					title: '实际业绩',
					key: 'real_performance',
					minWidth: 160
				}
			]
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('STATISTIC_BUSINESS_SALE_RANK_STAFF_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('STATISTIC_BUSINESS_SALE_RANK_STAFF_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		}
	}
};