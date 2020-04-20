export const getTechRoutes = (auth, staff = {}) => ([
	{
		name: "项目管理",
		icon: "iconfont icon-custoemr",
		show: auth[1409],
		route: "/tech/project",
		children: [
			{
				name: "项目规划",
				icon: "",
				show: auth[1410],
				route: "/tech/project/plan",
				children: [
					{
						name: "项目总览",
						icon: "",
						show: auth[1411],
						route: "/tech/project/plan/overview"
					},
					{
						name: "项目需求",
						icon: "",
						show: auth[1415],
						route: "/tech/project/plan/demand"
					},
					{
						name: "项目值班",
						icon: "",
						show: auth[1420],
						route: "/tech/project/plan/duty"
					}
				]

			},
			{
				name: "内容发布",
				icon: "",
				show: auth[1422],
				route: "/tech/project/publish",
				children: [
					{
						name: "更新通知",
						icon: "",
						show: auth[1423],
						route: "/tech/project/publish/notice"
					},
					{
						name: "功能解读",
						icon: "",
						show: auth[1429],
						route: "/tech/project/publish/document"
					}
				]
			}
			
		]
	}
	
]);
