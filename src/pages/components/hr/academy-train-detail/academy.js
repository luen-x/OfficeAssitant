const breadCrumbInfo = {
	'/hr/academy/train/detail/vote/2/edit': [{ name: '编辑投票', path: '' }],
	'/hr/academy/train/detail/vote/2/provide': [{ name: '发放投票', path: '' }],
	'/hr/academy/train/detail/vote/2/result': [{ name: '投票结果', path: '' }],

	'/hr/academy/train/detail/enroll/2/edit': [{ name: '编辑报名', path: '' }],
	'/hr/academy/train/detail/enroll/2/provide': [{ name: '发放报名', path: '' }],
	'/hr/academy/train/detail/enroll/2/result': [{ name: '报名结果', path: '' }],

	'/hr/academy/train/detail/draw/1/edit': [{ name: '编辑抽奖', path: '' }],
	'/hr/academy/train/detail/draw/1/provide': [{ name: '发放抽奖', path: '' }],
	'/hr/academy/train/detail/draw/1/result': [{ name: '抽奖结果', path: '' }]
};
// 第一个参数是权限对象  第二个参数是vue $route对象
export default (auth, { path }) => [
	{
		name: '基本信息',
		icon: 'icon-xinxi',
		show: auth[986],
		path: '/hr/academy/train/detail/basic',
		children: [
			{
				routes: [],
				showNav: true,
				path: '/hr/academy/train/detail/basic/0',
				children: [
					{
						name: '详情信息',
						show: auth[986],
						path: '/hr/academy/train/detail/basic/0/info'
					}
				]
			},
			{
				routes: [],
				showNav: true,
				path: '/hr/academy/train/detail/basic/1',
				children: [
					{
						show: true,
						name: '课程详情',
						path: '/hr/academy/train/detail/basic/1/detail'
					}
				]
			},
			{
				routes: [],
				showNav: true,
				path: '/hr/academy/train/detail/basic/2',
				children: [
					{
						name: '课程编辑',
						show: true,
						path: '/hr/academy/train/detail/basic/2/edit'
					}
				]
			}
		]
	},
	{
		name: '参与人员',
		icon: 'icon-canyurenyuan',
		show: auth[993],
		path: '/hr/academy/train/detail/participate',
		children: [
			{
				routes: [],
				showNav: true,
				path: '/hr/academy/train/detail/participate/0',
				children: [
					{
						name: '人员名单',
						show: auth[993],
						path: '/hr/academy/train/detail/participate/0/roster'
					}
				]
			}
		]
	},
	{
		name: '分组',
		show: auth[997],
		path: '/hr/academy/train/detail/group',
		children: [
			{
				routes: [],
				showNav: true,
				show: auth[997],
				path: '/hr/academy/train/detail/group/0',
				children: [
					{
						name: '分组',
						show: auth[997],
						path: '/hr/academy/train/detail/group/0/group'
					}
				]
			},
			{
				routes: [{
					path: '/hr/academy/train/detail/group/0/group',
					name: '分组'
				},
				{
					path: '',
					name: '随机分组'
				}
				],
				showNav: false,
				path: '/hr/academy/train/detail/group/1',
				children: [
					{
						name: '随机分组',
						show: true,
						path: '/hr/academy/train/detail/group/1/random'
					}
				]
			},
			{
				routes: [{
					path: '/hr/academy/train/detail/group/0/group',
					name: '分组'
				},
				{
					path: '',
					name: '手动分组'
				}
				],
				showNav: false,
				path: '/hr/academy/train/detail/group/2',
				children: [
					{
						name: '手动分组',
						show: true,
						path: '/hr/academy/train/detail/group/2/hand'
					}
				]
			}
		]
	},
	{
		name: '活动计划',
		icon: 'icon-jihua',
		show: auth[998],
		path: '/hr/academy/train/detail/paln',
		children: [
			{
				routes: [],
				showNav: true,
				path: '/hr/academy/train/detail/paln/0',
				children: [
					{
						name: '活动计划',
						show: auth[998],
						path: '/hr/academy/train/detail/paln/0/activity'
					}
				]
			}
		]
	},
	{
		name: '签到',
		show: auth[999],
		path: '/hr/academy/train/detail/sign',
		children: [
			{
				routes: [],
				showNav: true,
				path: '/hr/academy/train/detail/sign/0',
				children: [
					{
						name: '签到管理',
						show: auth[999],
						path: '/hr/academy/train/detail/sign/0/manage'
					}
				]
			},
			{
				routes: [{
					path: '',
					name: '新建签到'
				}],
				showNav: false,
				path: '/hr/academy/train/detail/sign/1',
				children: [
					{
						name: '新建签到',
						show: auth[999],
						path: '/hr/academy/train/detail/sign/1/add'
					}
				]
			},
			{
				routes: [{
					path: '',
					name: '编辑签到'
				}],
				showNav: false,
				path: '/hr/academy/train/detail/sign/2',
				children: [
					{
						name: '编辑签到',
						show: auth[999],
						path: '/hr/academy/train/detail/sign/2/edit'
					}
				]
			},
			{
				routes: [{
					path: '',
					name: '发放签到'
				}],
				showNav: false,
				path: '/hr/academy/train/detail/sign/3',
				children: [
					{
						name: '发放签到',
						show: auth[999],
						path: '/hr/academy/train/detail/sign/3/provide'
					}
				]
			},
			{
				routes: [{
					path: '',
					name: '签到结果'
				}],
				showNav: false,
				path: '/hr/academy/train/detail/sign/4',
				children: [
					{
						name: '签到结果',
						show: auth[999],
						path: '/hr/academy/train/detail/sign/4/result'
					}
				]
			}
		]
	},
	{
		name: '考试',
		show: auth[1009],
		path: '/hr/academy/train/detail/paper',
		children: [
			{
				routes: [],
				showNav: true,
				path: '/hr/academy/train/detail/paper/0',
				children: [
					{
						name: '通关试卷',
						show: true,
						path: '/hr/academy/train/detail/paper/0/pass'
					}, 
					{
						name: '审核考试',
						show: true,
						path: '/hr/academy/train/detail/paper/0/audit'
					}
				]
			},
			{
				routes: [{
					path: '/hr/academy/train/detail/paper/0/pass',
					name: '通关试卷',
				},
				{
					path: '',
					name: '新建试卷'
				}
				],
				showNav: false,
				path: '/hr/academy/train/detail/paper/1',
				children: [
					{
						name: '新建试卷',
						show: true,
						path: '/hr/academy/train/detail/paper/1/add'
					} 
				]
			},
			{
				routes: [{
					path: '/hr/academy/train/detail/paper/0/pass',
					name: '通关试卷'
				},
				{
					path: '',
					name: '安排考试'
				}
				],
				showNav: false,
				path: '/hr/academy/train/detail/paper/2',
				children: [
					{
						name: '安排考试',
						show: true,
						path: '/hr/academy/train/detail/paper/2/arrange'
					} 
				]
			},
			{
				routes: [{
					path: '/hr/academy/train/detail/paper/0/pass',
					name: '通关试卷'
				},
				{
					path: '',
					name: '考试结果'
				}
				],
				showNav: false,
				path: '/hr/academy/train/detail/paper/3',
				children: [
					{
						name: '考试结果',
						show: true,
						path: '/hr/academy/train/detail/paper/3/result'
					} 
				]
			}
		]
	},
	{
		name: '投票',
		path: '/hr/academy/train/detail/vote',
		show: auth[1019],
		children: [
			{
				routes: [],
				showNav: true,
				path: '/hr/academy/train/detail/vote/0',
				children: [
					{
						name: '投票管理',
						show: auth[1019],
						path: '/hr/academy/train/detail/vote/0/manage'
					}
				]
			},
			{
				routes: [
					{
						path: '',
						name: '新建投票'
					}
				],
				showNav: false,
				path: '/hr/academy/train/detail/vote/1',
				children: [
					{
						name: '新建投票',
						show: true,
						path: '/hr/academy/train/detail/vote/1/add'
					}
				]
			},
			{
				routes: breadCrumbInfo[path],
				showNav: true,
				path: '/hr/academy/train/detail/vote/2',
				children: [
					// {
					// 	name: '编辑投票',
					// 	show: true,
					// 	path: '/hr/academy/train/detail/vote/2/edit'
					// },
					// {
					// 	name: '发放设置',
					// 	show: true,
					// 	path: '/hr/academy/train/detail/vote/2/provide'
					// },
					// {
					// 	name: '统计结果',
					// 	show: true,
					// 	path: '/hr/academy/train/detail/vote/2/result'
					// }
				]
			}
			
		]
	},
	{
		name: '链接报名',
		path: '/hr/academy/train/detail/enroll',
		show: auth[1024],
		children: [
			{
				routes: [],
				showNav: true,
				path: '/hr/academy/train/detail/enroll/0',
				children: [
					{
						name: '报名管理',
						show: auth[1024],
						path: '/hr/academy/train/detail/enroll/0/manage'
					}
				]
			},
			{
				routes: [{
					name: '新建报名'
				}],
				showNav: false,
				path: '/hr/academy/train/detail/enroll/1',
				children: [
					{
						name: '新建报名',
						show: true,
						path: '/hr/academy/train/detail/enroll/1/add'
					}
				]
			},
			{
				routes: breadCrumbInfo[path],
				showNav: true,
				path: '/hr/academy/train/detail/enroll/2',
				children: [
					// {
					// 	name: '编辑报名',
					// 	show: true,
					// 	path: '/hr/academy/train/detail/enroll/2/edit'
					// },
					// {
					// 	name: '发放报名',
					// 	show: true,
					// 	path: '/hr/academy/train/detail/enroll/2/provide'
					// },
					// {
					// 	name: '报名结果',
					// 	show: true,
					// 	path: '/hr/academy/train/detail/enroll/2/result'
					// }
				]
			}
			
		]
	},
	{
		name: '抽奖',
		path: '/hr/academy/train/detail/draw',
		show: auth[1030],
		children: [
			{
				routes: [],
				showNav: true,
				path: '/hr/academy/train/detail/draw/0',
				children: [
					{
						name: '抽奖管理',
						show: auth[1030],
						path: '/hr/academy/train/detail/draw/0/manage'
					}
				]
			},
			{
				routes: breadCrumbInfo[path],
				showNav: true,
				path: '/hr/academy/train/detail/draw/1',
				children: [
					// {
					// 	name: '编辑抽奖',
					// 	show: true,
					// 	path: '/hr/academy/train/detail/draw/1/edit'
					// },
					// {
					// 	name: '发放抽奖',
					// 	show: true,
					// 	path: '/hr/academy/train/detail/draw/1/provide'
					// },
					// {
					// 	name: '抽奖结果',
					// 	show: true,
					// 	path: '/hr/academy/train/detail/draw/1/result'
					// }
				]
			}
			
		]
	}
];
