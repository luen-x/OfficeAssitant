export const getContentRoutes = (auth) => [
	{
		name: "素材库配置",
		icon: "icon-tool2",
		show: false,
		route: "/content/config",
		children: [
			{
				name: "销售工具包",
				icon: "",
				show: auth[8],
				route: "/content/config/setoolkit",
				children: [
					{
						name: "素材管理",
						icon: "",
						show: auth[610],
						route: "/content/config/setoolkit/manage"
					},
					{
						name: "类目设置",
						icon: "",
						show: auth[611],
						route: "/content/config/setoolkit/set"
					},
					{
						name: "下载记录",
						icon: "",
						show: auth[612],
						route: "/content/config/setoolkit/download"
					}
				]

			},
			{
				name: "服务工具包",
				icon: "",
				show: auth[9],
				route: "/content/config/satoolkit",
				children: [
					{
						name: "素材管理",
						icon: "",
						show: auth[621],
						route: "/content/config/satoolkit/manage"
					},
					{
						name: "类目设置",
						icon: "",
						show: auth[622],
						route: "/content/config/satoolkit/set"
					},
					{
						name: "下载记录",
						icon: "",
						show: auth[623],
						route: "/content/config/satoolkit/download"
					}
				]

			},
			{
				name: "素材库",
				icon: "",
				show: auth[1193],
				route: "/content/config/material",
				children: [
					{
						name: "素材库",
						icon: "",
						show: auth[1194],
						route: "/content/config/material/bank"
					},
					{
						name: "素材审核",
						icon: "",
						show: auth[1203],
						route: "/content/config/material/check"
					},
					{
						name: "权限审核",
						icon: "",
						show: auth[1213],
						route: "/content/config/material/role"
					},
					{
						name: "类目设置",
						icon: "",
						show: auth[1220],
						route: "/content/config/material/set"
					},
					{
						name: "素材记录",
						icon: "",
						show: auth[1224],
						route: "/content/config/material/record"
					}
				]

			},
			{
				name: "下载统计",
				icon: "",
				show: auth[1490],
				route: "/content/config/statistics",
				children: [
					{
						name: "下载统计",
						icon: "",
						show: auth[1491],
						route: "/content/config/statistics/manage",
						// route: "/content/config/statistics/manage/detail",详情
					},
					{
						name: "预警设置",
						icon: "",
						show: auth[1492],
						route: "/content/config/statistics/warning",
					}
				]
			}
		]
	},
	{
		name: "产品管理",
		icon: "icon-product1",
		show: auth[10],
		route: "/content/product",
		children: [
			{
				name: "产品列表",
				icon: "",
				show: auth[17],
				route: "/content/product/list"
			},
			{
				name: "组合产品",
				icon: "",
				show: auth[19],
				route: "/content/product/group"
			},
			{
				name: "设置",
				icon: "",
				show: auth[18],
				route: "/content/product/set",
				children: [
					{
						name: "流程管理",
						icon: "",
						show: auth[27],
						route: "/content/product/set/process"
					},
					{
						name: "项目需求",
						icon: "",
						show: auth[28],
						route: "/content/product/set/project"
					},
					{
						name: "客户信息",
						icon: "",
						show: auth[29],
						route: "/content/product/set/customer"
					}
				]
			}
		]
	},
	{
		name: "资讯管理",
		icon: "icon-consult",
		show: auth[13],
		route: "/content/information",
		children: [
			{
				name: "资讯管理",
				icon: "",
				show: auth[53],
				route: "/content/information/manage"
			},
			{
				name: "资讯分类",
				icon: "",
				show: auth[54],
				route: "/content/information/classify"
			},
			{
				name: "资料发布",
				icon: "",
				show: auth[1543],
				route: "/content/information/publish"
			}
		]
	},
	{
		name: "通知管理",
		icon: "icon-envelope",
		show: auth[14],
		route: "/content/notice",
		children: [
			{
				name: "通知消息",
				icon: "",
				show: auth[1496],
				route: "/content/notice/inform"
			},
			{
				name: "微信推送",
				icon: "",
				show: auth[1497],
				route: "/content/notice/wechat"
			}
		]
	},
	{
		name: "活动管理",
		icon: "icon-huodong",
		show: auth[15],
		route: "/content/activity",
		children: [
			{
				name: "活动列表",
				icon: "",
				show: auth[66],
				route: "/content/activity/list"
			},
			{
				name: "活动审核",
				icon: "",
				show: auth[67],
				route: "/content/activity/audit"
			},
			{
				name: "活动分类",
				icon: "",
				show: auth[68],
				route: "/content/activity/classify"
			}
		]
	},
	{
		name: "大屏互动管理",
		icon: "icon-computer",
		show: auth[16],
		route: "/content/interaction"
	},
	{
		name: "服务项管理",
		icon: "icon-fuwuxiangmu",
		show: auth[731],
		route: "/content/service",
		children: [
			{
				name: "服务项管理",
				icon: "",
				show: true,
				route: "/content/service/setting"
			}
		]
	},

	{
		name: "销售规则配置",
		icon: "icon-GeneralSettin",
		show: _global.staff.is_charge,
		route: "/content/rules/sale",
	},
	{
		name: "微币奖惩设置",
		icon: "icon-jifen1",
		show: auth[1715],
		route: "/content/reward",
	},
	{
		name: "道具参数设置",
		icon: "icon-tool2",
		show: auth[1716],
		route: "/content/prop/set",
	},
	{
		name: "发圈素材管理",
		icon: "icon-sucaiku",
		show: auth[1754],
		route: "/content/circle",
		children: [
			{
				name: "发圈素材管理",
				icon: "",
				show: true,
				route: "/content/circle/list"
			}
		]
	}
];