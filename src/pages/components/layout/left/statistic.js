export const getStatisticRoutes = (auth) => [
	{
		name: '业务数据统计',
		icon: 'icon-statistics1',
		show: auth[1778],
		route: '/statistic/business',
		children: [
			{
				name: '销售数据',
				show: auth[1779],
				route: '/statistic/business/sale'
			},
			{
				name: '客户数据',
				show: auth[1800],
				route: '/statistic/business/customer'
			}
		]
	},
	{
		name: '数据配置',
		icon: 'icon-shezhi',
		show: auth[1801],
		route: '/statistic/config',
		children: [
			{
				name: '产品成本配置',
				show: auth[1802],
				route: '/statistic/config/cost'
			},
			{
				name: '退款原因配置',
				show: auth[1805],
				route: '/statistic/config/reason'
			}
		]
	}
];