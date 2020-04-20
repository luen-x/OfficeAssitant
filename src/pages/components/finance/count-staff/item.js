import Explain from '@components/_common/explain/explain';

export default {
	data() {
		return {
			columns: [
				{
					title: '姓名',
					key: 'staff_name',
					minWidth: 150
				},
				{
					title: '手机号',
					key: 'mobile',
					width: 150
				},
				{
					title: '部门简称',
					key: 'abbreviation',
					minWidth: 120
				},
				// {
				// 	title: '实付金额',
				// 	key: 'pay_performance',
				// 	minWidth: 120
				// },
				{
					title: 'PK业绩',
					key: 'pk_performance',
					minWidth: 120,
					renderHeader: (h, params) => {
						return (
							<div class="g-c-black2" style={{ fontWeight: 400 }}>
								PK业绩
								<Explain
									style={{ marginLeft: '2px' }}
									title="客户实际支付的金额，不用减手续费和退款，需要考虑分单情况"
									content="例：当月客户打款10万，分单出去5万，则PK业绩为5万"
								/>
							</div>
						);
					}
				},
				{
					title: '提成业绩',
					key: 'minus_performance',
					minWidth: 120,
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
					}
				},
				
				{
					title: '总提成',
					key: 'total_commission',
					minWidth: 120,
					renderHeader: (h, params) => {
						return (
							<div class="g-c-black2" style={{ fontWeight: 400 }}>
								总提成
								<Explain
									style={{ marginLeft: '2px' }}
									title="当月提成业绩乘以提成点所得"
									content="例：员工A的当月提成业绩为10万，A的固定提成点为10%，员工A当月的总提成为1万"
								/>
							</div>
						);
					}
				},
				{
					title: '实发提成',
					key: 'grant_commission',
					minWidth: 120,
					renderHeader: (h, params) => {
						return (
							<div class="g-c-black2" style={{ fontWeight: 400 }}>
								实发提成
								<Explain
									style={{ marginLeft: '2px' }}
									title="当月实际发放给员工的提成，实发提成=总提成-服务提成+达标服务提成-扣回提成"
									content="如员工A的总提成为1万，服务提成为400，当月达标的服务提成为0，应扣回提成为5000，则员工A当月的实发提成为4600"
								/>
							</div>
						);
					}
				},
				{
					title: '应扣回提成',
					key: 'deduction_commission',
					minWidth: 120
				},
				// {
				// 	title: '达标服务提成',
				// 	key: 'grant_service_commission',
				// 	minWidth: 120
				// },
				{
					title: '服务提成',
					key: 'service_commission',
					minWidth: 120
				},
				
				{
					title: '操作',
					key: 'title',
					minWidth: 100,
					render: (h, params) => {
						return this.$auth['1384'] ? h('div', {
							class: "g-operation",
							style: {
								marginRight: '5px',
							},
							on: {
								click: () => {									
									const { query = {} } = this.$route;
									this.handleLinkTo(
										params.row.staff_id, 
										query.month == undefined ? '' : query.month, 
										params.row.staff_name
									);								
								}
							}
						}, '查看详情') : '';
					}
				}


			],
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('FINANCE_COUNT_STAFF_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('FINANCE_COUNT_STAFF_LIST_RESET', { type: this.type });
		},
		handleLinkTo(staff_id, month, staff_name) {
			this.$router.push('/finance/count/staff/detail?staff_id=' + staff_id + '&month=' + month + '&staff_name=' + staff_name);
		},
	}
};

