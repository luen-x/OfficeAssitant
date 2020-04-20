export const getStatisticsRoutes = (auth) => [
	{
		name: '客户统计',
		icon: 'icon-home',
		show: auth[660],
		route: '/statistics/customer',
		children: [
			{
				name: '客户分布统计',
				show: auth[661],
				route: '/statistics/customer/distribution',
			},
			{
				name: '员工客户统计',
				show: auth[662],
				route: '/statistics/customer/employee',
				children: [
					{
						name: '新增客户排名',
						show: auth[663],
						route: '/statistics/customer/employee/new',
					},
					{
						name: '客户类型统计',
						show: auth[664],
						route: '/statistics/customer/employee/type',
					}
				]
			}
		]
	},
	{
		name: '成交统计',
		icon: 'icon-make2',
		show: auth[665],
		route: '/statistics/deal',
		children: [
			{
				name: '成交客户统计',
				show: auth[666],
				route: '/statistics/deal/customer',
			},
			{
				name: '退款数据统计',
				show: auth[667],
				route: '/statistics/deal/refund',
			},
			{
				name: '客户转手率',
				show: auth[668],
				route: '/statistics/deal/switch',
			}
		]
	},
	{
		name: '质检统计',
		icon: 'icon-quality-test',
		show: false,
		route: '/statistics/quality',
		children: [
			{
				name: '质检数据',
				show: auth[670],
				route: '/statistics/quality/data',
			},
			{
				name: '质检排名',
				show: auth[671],
				route: '/statistics/quality/rank',
			}
		]
	}
];