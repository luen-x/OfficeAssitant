export const getAcademyRoutes = (auth) => [
	{
		name: '首页',
		icon: 'icon-home',
		show: auth['1552'],
		route: '/academy/main',
	},
	{
		name: '新人输送',
		icon: 'icon-wenzikuai',
		show: auth['1562'],
		route: '/academy/transfer',
		children: [
			{
				name: '新人输送',
				show: auth['1563'],
				route: '/academy/transfer/transfer',
			},
			{
				name: '数据统计',
				show: auth['1574'],
				route: '/academy/transfer/statistics',
			}
		]
	},
	{
		name: '培训中心',
		icon: 'icon-person-manage',
		show: auth['1585'],
		route: '/academy/train',
		children: [
			// {
			// 	name: '课程表',
			// 	show: auth['790'],
			// 	route: '/academy/train/schedule',
			// },
			{
				name: '培训安排',
				show: auth['1586'],
				route: '/academy/train/plan',
			},
			{
				name: '通关上传',
				show: auth['1599'],
				route: '/academy/train/upload',
			}
		]
	},
	{
		name: '三立支持',
		icon: 'icon-jihua',
		show: auth['1602'],
		route: '/academy/support',
		children: [
			{
				name: '工具包支持',
				show: auth['1603'],
				route: '/academy/support/tool',
				children: [
					{
						name: '素材管理',
						show: auth['1604'],
						route: '/academy/support/tool/manage',
					},
					{
						name: '类目设置',
						show: auth['1610'],
						route: '/academy/support/tool/set',
					},
					{
						name: '下载记录',
						show: auth['1616'],
						route: '/academy/support/tool/download',
					}
				]
			},
			{
				name: '自习室支持',
				show: auth['1617'],
				route: '/academy/support/study',
				children: [
					{
						name: '自习室',
						show: auth['1618'],
						route: '/academy/support/study/manage',
					},
					{
						name: '类目设置',
						show: auth['1624'],
						route: '/academy/support/study/set',
					},
					{
						name: '下载记录',
						show: auth['1630'],
						route: '/academy/support/study/download',
					}
				]
			},
			{
				name: '客户案例',
				show: auth[1758],
				route: '/academy/support/case',
			},
			{
				name: '课程支持',
				show: auth['1631'],
				route: '/academy/support/course',
			},
			{
				name: "下载统计",
				icon: "",
				show: auth[1636],
				route: "/academy/support/statistics",
				children: [
					{
						name: "下载统计",
						icon: "",
						show: auth[1637],
						route: "/academy/support/statistics/manage",
						// route: "/academy/support/statistics/manage/detail",详情
					},
					{
						name: "预警设置",
						icon: "",
						show: auth[1640],
						route: "/academy/support/statistics/warning",
					}
				]
			}
		]
	},
	{
		name: '统计中心',
		icon: 'icon-shaokexuefushanggangpeixunxiaoshu',
		show: auth['1644'],
		route: '/academy/statistics',
		children: [
			{
				name: '学员数据',
				show: auth['1645'],
				route: '/academy/statistics/student',
			},
			{
				name: '课程数据',
				show: auth['1647'],
				route: '/academy/statistics/course',
			}
		]
	}
];
