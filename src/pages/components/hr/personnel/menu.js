export const getChunks = (auth) => [
	{
		name: '我的微币',
		path: '/hr/personnel/currency',
		show: auth[1709],
	},
	{
		name: '举报信息',
		path: '/hr/personnel/report',
		show: auth[1704],
	},
	{
		name: '我的资料',
		path: '/hr/personnel/info',
		show: auth[1225],
	},
	{
		name: '我的员工',
		path: '/hr/personnel/member',
		show: auth[1231],
		children: [
			{
				show: auth[1232],
				name: '我的员工',
				path: '/hr/personnel/member/staff',
				// children: [
				// 	{
				// 		show: auth[1233],
				// 		name: '我的员工详情',
				// 		path: '/hr/personnel/member/staff/info'
				// 	}
				// ]
			},
			{
				// routes: [],
				// showNav: true,
				show: auth[1745],
				name: '校招分配',
				path: '/hr/personnel/member/distribution'
			},
			{
				// routes: [],
				// showNav: true,
				show: auth[1234],
				name: '师徒关系',
				path: '/hr/personnel/member/relationship'
			},
			{
				show: auth[1238],
				name: '微一案师傅',
				path: '/hr/personnel/member/master'
			}
		]
	}
];
export const getIndexRoute = (menu) => {
	if (menu.children && menu.children.filter(i => i.show).length) {
		return getIndexRoute(menu.children.filter(i => i.show)[0]);
	} else {
		return menu.path;
	}
};