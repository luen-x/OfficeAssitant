export const getAdminRoutes = (auth) => [
	{
		name: '事项处理',
		icon: 'icon-collaborate',
		show: auth['1273'],
		route: '/administration/matter',
		children: [
			{
				name: '事项公海',
				show: auth['790'],
				route: '/administration/matter/sea',
			},
			{
				name: '我的事项',
				show: auth['793'],
				route: '/administration/matter/my',
			},
			{
				name: '审批设置',
				show: auth['798'],
				route: '/administration/matter/setting',
				children: [
					{
						name: '事项类型',
						show: auth['821'],
						route: '/administration/matter/setting/type',
					}
					// {
					// 	name: '申请权限',
					// 	show: auth['83'],
					// 	route: '/administration/matter/setting/apply',
					// }
				]
			}
		]
	},
	{
		name: "申请",
		show: true,
		fullRouter: true,
		route: "/administration/application",
		children: [
			{
				name: '我的申请',
				icon: '',
				show: true,
				route: "/administration/application/mine"
			},
			{
				name: '待我审核',
				icon: '',
				show: auth['784'],
				route: "/administration/application/wait"
			}
		]
	},
	{
		name: '话机管理',
		icon: 'icon-dianhuaji',
		show: auth['1023'],
		route: '/administration/phone',
	}
];
