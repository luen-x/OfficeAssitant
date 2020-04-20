/**
 * 模块
 */
export const getChunks = (auth) => [
	{
		value: 'sale',
		name: '销售板块',
		show: auth[1],
		route: '/sale'
	},
	{
		value: 'sc',
		name: '立客户中心',
		show: auth[2],
		route: '/sc'
	},
	{
		value: 'hr',
		name: '人事',
		show: auth[3],
		route: '/hr'
	},
	{
		value: 'collage',
		name: '商学院',
		show: auth[4],
		route: '/collage'
	},
	{
		value: 'finance',
		name: '财务',
		show: auth[5],
		route: '/finance'
	},
	{
		value: 'content',
		name: '内容管理',
		show: auth[6],
		route: '/content',
	},
	{
		value: 'statistics',
		name: '数据统计',
		// show: auth[659],
		show: false,
		route: '/statistics',
	},
	{
		value: 'administration',
		name: '行政中心',
		show: auth[789],
		route: '/administration',
	},
	// {
	// 	value: 'worksheet',
	// 	name: '工单管理',
	// 	show: auth[789],
	// 	route: '/worksheet',
	// },
	{
		value: 'tech',
		name: '产品技术',
		show: auth[910],
		// show: false,
		route: '/tech',
	},
	{
		value: 'academy',
		name: '三立学府',
		show: auth[1518],
		// show: false,
		route: '/academy',
	},
	{
		value: 'statistic',
		name: '数据统计',
		show: auth[1777],
		route: '/statistic',
	},
	{
		value: 'settings',
		name: '设置',
		show: false,
		route: '/settings',
	}
];