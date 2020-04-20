export default {
	data() {
		return {
			columns: [
				{
					title: '公司名称',
					key: 'contract_company_name',
					minWidth: 250
				},
				{
					title: '客户姓名',
					key: 'customer_name',
					minWidth: 120
				},
				{
					title: '客户手机号',
					key: 'phone',
					minWidth: 160
				},
				{
					title: '退款类型',
					key: 'refund_type',
					minWidth: 120,
					render: (h, { row }) => {
						return (
							<div>{['产品退款', '', '余额退款'][row.refund_type - 1]}</div>
						);
					}
				},
				{
					title: '退款产品',
					key: 'product_name',
					minWidth: 120
				},
				{
					title: '退款金额',
					key: 'refund_amount',
					minWidth: 160
				},
				{
					title: '退款原因',
					key: 'reason',
					minWidth: 160,
					render: (h, { row }) => {
						let reason = row.reason.map(item => {
							return item.reason.category_name + '-' + item.reason.reason_name;
						});

						if (reason.length > 0) {
							return (
								<div>{reason.join(',')}</div>
							);
						} else {
							return (
								<div>-</div>
							);
						}
					}
				},
				{
					title: '邀约人',
					key: 'staff_name',
					minWidth: 160
				}
			]
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('STATISTIC_BUSINESS_SALE_REFUND_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('STATISTIC_BUSINESS_SALE_REFUND_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		}
	}
};