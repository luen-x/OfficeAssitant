import Explain from '@components/_common/explain/explain';

export default {
	data() {
		return {
			items: [
				{
					label: '客户姓名',
					value: 'customer_name',
				},
				{
					label: '客户手机号',
					value: 'phone'
				},
				// {
				// 	label: '合同金额',
				// 	value: 'contract_amount'
				// },
				// {
				// 	label: '应付金额',
				// 	value: 'need_amount',
				// 	explain: true,
				// 	title: '客户应该付款的金额',
				// 	content: '如：微商系统合同的标准金额是13.98万，销售给客户优惠后的价格是10万，优惠后的金额即应付金额，即应付金额是10万'
				// },
				// {
				// 	label: '实付金额',
				// 	value: 'payment_amount',
				// 	explain: true,
				// 	title: '客户实际支付的金额',
				// 	content: '举例：客户想购买产品A，通过谈判最后确定的价格为10万，客户打款的10万为实付金额'
				// },
				// {
				// 	label: '剩余尾款',
				// 	value: 'last_amount',
				// 	explain: true,
				// 	content: '客户合作后还未付清的费用，假如产品A需要10万，客户下单支付8万，则剩余尾款为2万'
				// },
				// {
				// 	label: '产品成本',
				// 	value: 'total_need_cost_amount'
				// },
				// {
				// 	label: '实扣成本',
				// 	value: 'total_cost_amount',
				// 	explain: true,
				// 	title: '产品实际扣除的成本',
				// 	content: '产品实际扣除的成本，个别培训类产品可能不会一次性扣除所有的成本'
				// },
				// {
				// 	label: '提成业绩',
				// 	value: 'commission_performance',
				// 	explain: true,
				// 	title: '当月可以算提成的业绩',
				// 	content: '如：销售下单的所有产品的实付金额为11万，产品的总共成本是1万，则当月的提成业绩是10万'
				// },
				// {
				// 	label: '服务提成',
				// 	value: 'total_service_amount'
				// },
				{
					label: '邀约人',
					value: 'invite_staff_name'
				},
				{
					label: '谈判人',
					value: 'negotiator'
				},
				{
					label: '下单人',
					value: 'staff_name'
				},
				{
					label: '下单时间',
					value: 'create_time'
				}
			],
			remainItems: [
				{
					label: '客户姓名',
					value: 'customer_name'
				},
				{
					label: '客户手机号',
					value: 'phone'
				},
				{
					label: '退款类型',
					value: 'refund_type_name'
				},
				{
					label: '邀约人',
					value: 'invite_staff_name'
				}
			]
		};
	},
	computed: {
		getItems() {
			let items = [...this.items];
			switch (this.name) {				
				case 'refund':
				case 'deal-refund':
					items = [...this.remainItems];
					break;
				default:
				case 'contract': 
				case 'elec':
					break;
			}
			return items;
		}
	}
};
