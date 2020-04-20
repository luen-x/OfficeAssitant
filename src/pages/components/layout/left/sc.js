export const getSCRoutes = (auth) => {
	return [
		{
			name: '首页',
			icon: 'icon-home',
			show: auth[296],
			route: '/sc/main'
		},
		{
			name: '合作客户',
			icon: 'icon-collaborate',
			show: auth[297],
			route: '/sc/customer',
			children: [
				{
					name: '客户合同',
					show: auth[300],
					route: '/sc/customer/cooperate',
				},
				// {
				// 	name: '预分配',
				// 	show: auth[836],
				// 	route: '/sc/customer/predistribute',
				// },
				{
					name: '交接表审核',
					show: auth[1284],
					route: '/sc/customer/handover',
				},
				{
					name: '退款申请',
					show: auth[301],
					route: '/sc/customer/refund',
				}
			]
		},
		{
			name: '产品制作',
			icon: 'icon-make2',
			show: auth[298],
			route: '/sc/product'
		},
		{
			name: '质检管理',
			icon: 'icon-quality-test',
			show: auth[299],
			route: '/sc/manage',
			children: [
				{
					name: '质检管理',
					show: auth[1481],
					route: '/sc/manage/inspection'
				},
				{
					name: '数据统计',
					show: auth[1482],
					route: '/sc/manage/statistics',
					children: [
						{
							name: '数据统计',
							show: auth[1483],
							route: '/sc/manage/statistics/data'	
						}, 
						{
							name: '市场服务数据',
							show: auth[1484],
							route: '/sc/manage/statistics/market'	
						}
					]
				}
			]
		},
		{
			name: '服务质检',
			icon: 'icon-fuwuzhijian',
			show: auth[345],
			route: '/sc/service',
			children: [
				{
					name: '服务质检',
					show: auth[345],
					route: '/sc/service/inspection',
				}
			]
		},
		{
			name: 'OA意见反馈箱',
			icon: '',
			route: '/sc/views'
		}
	]; 
};