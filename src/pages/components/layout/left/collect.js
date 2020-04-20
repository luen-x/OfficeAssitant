export const getCollectRoutes = (auth) => [
	{
		name: "资料看考",
		show: true,
		fullRouter: true,
		route: "/material/main",
		children: [
			{
				name: '客户案例',
				icon: '',
				show: true,
				route: "/material/main/case",
				children: [
					{
						name: '编辑案例',
						icon: '',
						show: true,
						route: "/material/main/case/edit"
					},
					{
						name: '案例详情',
						icon: '',
						show: true,
						route: "/material/main/case/detail"
					}
				]
			},
			{
				name: '项目管理',
				icon: '',
				show: auth[1510],
				route: "/worksheet/control/project"
			}
		]
	}
];