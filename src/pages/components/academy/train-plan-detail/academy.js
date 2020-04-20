// 第一个参数是权限对象  第二个参数是vue $route对象
export default (auth, { path }) => [
	{
		name: '参与人员',
		icon: 'icon-canyurenyuan',
		show: auth[1594],
		path: '/academy/train/plan/detail/participate',
		// children: [
		// 	{
		// 		routes: [],
		// 		showNav: false,
		// 		path: '/hr/academy/train/detail/participate',
		// 	}
		// ]
	},
	{
		name: '签到',
		icon: 'icon-qiandao',
		show: auth[1591],
		path: '/academy/train/plan/detail/sign',
	},
	{
		name: '考试',
		icon: 'icon-kaoshi',
		show: auth[1592],
		path: '/academy/train/plan/detail/exam',
	}
];
