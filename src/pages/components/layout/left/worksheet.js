export const getWorksheetRoutes = (auth) => [
	{
		name: "工单管理",
		show: true,
		fullRouter: true,
		route: "/worksheet/control",
		children: [
			{
				name: 'bug管理',
				icon: '',
				show: auth[1505],
				route: "/worksheet/control/bug"
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
