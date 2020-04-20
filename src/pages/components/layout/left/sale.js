export const getSaleRoutes = (auth) => (
	[{
		name: "我的首页",
		icon: "iconfont icon-home",
		show: auth[360],
		route: "/sale/main",
	},
	{
		name: "呼叫", // 无侧边栏
		show: auth[600],
		fullRouter: true,
		route: "/sale/call",
		children: [
			{
				name: '拨号管理',
				icon: '',
				show: auth[1022],
				route: "/sale/call/manage"
			},
			{
				name: '通话记录',
				icon: '',
				show: auth[601],
				route: "/sale/call/record"
			}
		]
	},
	{
		name: "客户管理",
		icon: "iconfont icon-custoemr",
		show: auth[361],
		route: "/sale/customer",
		children: [
			{
				name: "意向客户",
				icon: "",
				show: auth[373],
				route: "/sale/customer/intention"
			},
			{
				name: "成交客户",
				icon: "",
				show: auth[380],
				route: "/sale/customer/deal",
				children: [
					{
						name: "到账记录",
						icon: "",
						show: auth[408],
						route: "/sale/customer/deal/arrive"
					},
					{
						name: "客户合同",
						icon: "",
						show: auth[409],
						route: "/sale/customer/deal/contract"
					},
					{
						name: "成交客户",
						icon: "",
						show: auth[410],
						route: "/sale/customer/deal/deal"
					},
					{
						name: "补款申请",
						icon: "",
						show: true,
						route: "/sale/customer/deal/supply"
					},
					{
						name: "退款申请",
						icon: "",
						show: auth[411],
						route: "/sale/customer/deal/refund"
					},
					{
						name: "关联公司申请",
						icon: "",
						show: auth[450], // todo 权限
						route: "/sale/customer/deal/relation"
					}
				]
			},
			{
				name: "业务数据",
				icon: "",
				show: auth[964],
				route: "/sale/customer/business"
			},
			{
				name: "业务审核",
				icon: "",
				show: auth[1717],
				route: "/sale/customer/audit",
				children: [
					{
						name: "错误关联审核",
						icon: "",
						show: auth[1718],
						route: "/sale/customer/audit/mistake"
					},
					{
						name: "延期审核",
						icon: "",
						show: auth[1721],
						route: "/sale/customer/audit/delay"
					}
				]
			}
		]
	},
	{
		name: "公海档案",
		icon: "iconfont icon-folder",
		show: auth[362],
		route: "/sale/sea",
		children: [
			{
				name: "公海档案",
				icon: "",
				show: auth[473],
				route: "/sale/sea/archive"
			},
			// {
			// 	name: "领取设置",
			// 	icon: "",
			// 	show: false,
			// 	route: "/sale/sea/setting"
			// },
			{
				name: "黑名单",
				icon: "",
				show: auth[686],
				route: "/sale/sea/black"
			},
			{
				name: "白名单",
				icon: "",
				show: auth[481],
				route: "/sale/sea/white"
			}
		]
	},

	{
		name: "每日服务",
		icon: "iconfont icon-server",
		show: auth[363],
		route: "/sale/service/customer"
	},
	{
		name: "实时业绩",
		icon: "iconfont icon-performance",
		show: auth[364],
		route: auth[364] && (_global.staff.is_charge || _global.staff.depart_is_charge) ? "/sale/achievement" : '/sale/achievement/staff'
	},
	// {
	// 	name: "服务工具包",
	// 	icon: "iconfont icon-tool",
	// 	show: auth[365],
	// 	route: "/sale/setoolkit"
	// },
	{
		name: "工具包",
		icon: "iconfont icon-folder1",
		show: auth[365],
		route: "/sale/satoolkit"
	},
	{
		name: "三立培训",
		icon: "iconfont icon-jihua",
		show: auth[496],
		route: "/sale/train",
		children: [
			{
				name: "课程安排",
				icon: "",
				show: auth[497],
				route: "/sale/train/course"
			},
			{
				name: "我的学习",
				icon: "",
				show: auth[501],
				route: "/sale/train/study"
			},
			{
				name: "员工学习",
				icon: "",
				show: auth[510],
				route: "/sale/train/employee"
			}
		]
	},
	{
		name: "积分学分",
		icon: "iconfont icon-danganguanli",
		show: auth[513],
		route: "/sale/fraction",
		children: [
			{
				name: "我的积分",
				icon: "",
				show: auth[514],
				route: "/sale/fraction/integral"
			},
			{
				name: "我的学分",
				icon: "",
				show: auth[517],
				route: "/sale/fraction/credit"
			},
			{
				name: "自习室",
				icon: "",
				show: auth[521],
				route: "/sale/fraction/material/bank",
				// children: [
				// 	{
				// 		name: "素材库",
				// 		icon: "",
				// 		show: auth[522],
				// 		route: "/sale/fraction/material/bank"
				// 	},
				// 	{
				// 		name: "申请查看",
				// 		icon: "",
				// 		show: auth[529],
				// 		route: "/sale/fraction/material/application"
				// 	},
				// 	{
				// 		name: "上传素材",
				// 		icon: "",
				// 		show: auth[130],
				// 		route: "/sale/fraction/material/upload"
				// 	}
				// ]
			}
		]
	},
	{
		name: "开票申请",
		icon: "iconfont icon-invoice",
		show: auth[367],
		route: "/sale/ticket"
	},
	{
		name: "道具中心",
		icon: "iconfont icon-product1",
		show: auth[1698],
		route: "/sale/property",
		children: [
			{
				name: "道具中心",
				icon: "",
				show: auth[1699],
				route: "/sale/property/center"
			},
			{
				name: "我的道具",
				icon: "",
				show: auth[1700],
				route: "/sale/property/mine"
			},
			{
				name: "道具管理",
				icon: "",
				show: auth[1701],
				route: "/sale/property/control",
			},
			{
				name: "微币管理",
				icon: "",
				show: auth[1702],
				route: "/sale/property/coin",
			}
		]
	}
	]);
