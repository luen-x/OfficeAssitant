
export const getCollageRoutes = (auth) => [
	{
		name: '首页',
		icon: 'icon-home',
		show: auth[1290],
		route: '/collage/main'
	},
	{
		name: '合作客户',
		icon: 'icon-collaborate',
		show: auth[113],
		route: '/collage/customer',
		children: [
			{
				name: '客户合同',
				show: auth[115],
				route: '/collage/customer/cooperate',
			},
			{
				name: '退款申请',
				show: auth[116],
				route: '/collage/customer/refund',
			}
		]
	},
	{
		name: '客户服务',
		icon: 'icon-peixun',
		show: auth[1293],
		route: '/collage/service'
	},
	{
		name: '课程录单',
		icon: 'icon-Courserecord',
		show: auth[1400],
		route: '/collage/record',
		children: [
			{
				name: '线上录单',
				show: auth[1401],
				route: '/collage/record/online',
			},
			{
				name: '线下录单',
				show: auth[1404],
				route: '/collage/record/outline',
			},
			{
				name: '大课录单',
				show: auth[1407],
				route: '/collage/record/lesson',
			}
		]
	},
	{
		name: '质检管理',
		icon: 'icon-yanzhengma2',
		show: auth[1340] || auth[1358],
		route: '/collage/check',
		children: [
			{
				name: '服务质检',
				show: auth[1340],
				route: '/collage/check/service',
			},
			{
				name: '质检统计',
				show: auth[1358],
				route: '/collage/check/statistic',
				children: [
					{
						name: '数据统计',
						show: auth[1359],
						route: '/collage/check/statistic/data',
					},
					{
						name: '质检统计',
						show: auth[1360],
						route: '/collage/check/statistic/check',
					}
				]
			}
		]
	},
	{
		name: '薪资统计',
		icon: 'icon-Salarystatistics',
		show: auth[1331],
		route: '/collage/salary'
	},
	{
		name: '常规配置',
		icon: 'icon-GeneralSettin',
		show: auth[1313],
		route: '/collage/setting',
		children: [
			{
				name: '课程设置',
				show: auth[1314],
				route: '/collage/setting/course',
			},
			{
				name: '员工补贴',
				show: auth[1319],
				route: '/collage/setting/subsidy',
			},
			{
				name: '促单提成',
				show: auth[1321],
				route: '/collage/setting/promoting',
			},
			{
				name: '团队提成',
				show: auth[1326],
				route: '/collage/setting/team',
			}
		]
	}
];
