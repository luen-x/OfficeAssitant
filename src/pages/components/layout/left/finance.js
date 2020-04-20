export const getFinanceRoutes = (auth) => [
	{
		name: '我的首页',
		icon: 'icon-home',
		show: auth['77'],
		route: '/finance/main'
	},
	{
		name: '合作客户',
		icon: 'icon-collaborate',
		show: auth['78'],
		route: '/finance/customer',
		children: [
			{
				name: '到账审核',
				show: auth['82'],
				route: '/finance/customer/achi',
			},
			{
				name: '客户合同',
				show: auth['83'],
				route: '/finance/customer/contract',
			},
			{
				name: '补款审核',
				show: auth['813'],
				route: '/finance/customer/supplement',
			},
			{
				name: '电子合同',
				show: auth['84'],
				route: '/finance/customer/elec',
			},
			{
				name: '打折申请',
				show: auth['1487'],
				route: '/finance/customer/discount',
			},
			{
				name: '退款申请',
				show: auth['85'],
				route: '/finance/customer/refund',
			},
			{
				name: '成交客户',
				show: auth['86'],
				showSelf: true,
				route: '/finance/customer/nego',
				children: [
					{
						name: '成交客户详情',
						show: true,
						isHide: true,
						route: '/finance/customer/nego/detail'
					}
				]
			}
			// {
			// 	name: '余额更改审核',
			// 	show: true,
			// 	route: '/finance/customer/remain',
			// }
			// {
			// 	name: '服务提成申诉',
			// 	show: auth['352'],
			// 	route: '/finance/customer/complain',
			// }
		]
	},
	{
		name: '业绩统计',
		icon: 'icon-performance',
		show: auth['79'],
		route: '/finance/count',
		children: [
			{
				name: '业绩统计',
				show: auth['88'],
				route: '/finance/count/achi',
			},
			{
				name: '员工业绩',
				show: auth['89'],
				route: '/finance/count/staff',
				children: [
					{
						name: '营销中心',
						show: auth['1458'],
						route: '/finance/count/staff/sale',
					},
					{
						name: '商学院',
						show: auth['1459'],
						route: '/finance/count/staff/collage',
					}
				]
			}
		]
	},
	{
		name: '开票审核',
		icon: 'icon-make-invoice',
		show: auth['80'],
		route: '/finance/ballot'
	},
	{
		name: '账单明细',
		icon: 'icon-detail',
		show: auth['81'],
		route: '/finance/bill',
		children: [
			{
				name: '到账记录',
				show: auth['91'],
				route: '/finance/bill/in',
			},
			{
				name: '出账记录',
				show: auth['92'],
				route: '/finance/bill/out',
			}
		]
	},
	{
		name: '服务提成',
		icon: 'icon-make-invoice',
		show: auth[1288],
		route: '/finance/services',
		children: [
			{
				name: '服务提成',
				show: auth[1289],
				route: '/finance/services/commission',
			},
			{
				name: '服务提成申诉',
				show: auth['352'],
				route: '/finance/services/complain',
			}
		]
	}
];
