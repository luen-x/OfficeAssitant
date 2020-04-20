export const getHRRoutes = (auth) => [
	{
		name: '首页',
		icon: 'icon-home',
		show: auth[125] || auth[126],
		route: '/hr/main'
	},
	{
		name: '招聘管理',
		icon: 'icon-wenzikuai',
		show: auth[127],
		route: '/hr/recruit',
		children: [
			{
				name: '校招管理',
				icon: '',
				show: auth[136],
				route: '/hr/recruit/school',
				children: [
					{
						name: '招聘会',
						show: auth[138],
						route: '/hr/recruit/school/jobfair',
					},
					{
						name: '校招总表',
						show: auth[137],
						route: '/hr/recruit/school/summary',
					},
					{
						name: '校招统计',
						show: auth[139],
						route: '/hr/recruit/school/statistics',
					},
					{
						name: '试岗分配',
						show: auth[700],
						route: '/hr/recruit/school/tryassign',
					},
					{
						name: '分配情况',
						show: auth[701],
						route: '/hr/recruit/school/assigndetails',
					},
					{
						name: '组织人员',
						show: auth[702],
						route: '/hr/recruit/school/organization',
					},
					{
						name: '招聘试卷',
						show: true,
						route: '/hr/recruit/school/paper',
					}
				]
			},
			{
				name: '社招管理',
				icon: '',
				show: auth[169],
				route: '/hr/recruit/social',
				children: [
					{
						name: '社招跟进',
						show: auth[170],
						route: '/hr/recruit/social/summary',
					},
					// {
					// 	name: '淘汰统计',
					// 	show: auth[646],
					// 	route: '/hr/recruit/social/talent',
					// },
					{
						name: '社招统计',
						show: auth[651],
						route: '/hr/recruit/social/statistics',
					},
					{
						name: '黑名单',
						show: auth[1531],
						route: '/hr/recruit/social/blacklist',
					}
				]
			},
			{
				name: '人才库',
				icon: '',
				show: auth[1534],
				route: '/hr/recruit/talent',
				children: [
					{
						name: '淘汰人才',
						show: auth[1652],
						route: '/hr/recruit/talent/obsolete',
					},
					{
						name: '离职人才',
						show: auth[1538],
						route: '/hr/recruit/talent/leave',
					}
				]
			}
		]
	},
	{
		name: '员工管理',
		icon: 'icon-person-manage',
		show: auth[128],
		route: '/hr/employee',
		children: [
			{
				name: '员工总表',
				icon: '',
				show: auth[194],
				route: '/hr/employee/summary'
			},
			{
				name: '员工关系',
				show: auth[203],
				route: '/hr/employee/relation',
				children: [
					{
						name: '试用转正',
						show: auth[215],
						route: '/hr/employee/relation/try',
					},
					{
						name: '员工合同',
						show: auth[220],
						route: '/hr/employee/relation/pact',
					},
					{
						name: '员工转岗',
						show: auth[221],
						route: '/hr/employee/relation/tran',
					},
					{
						name: '离职管理',
						show: auth[222],
						route: '/hr/employee/relation/leave',
					}
				]
			},
			{
				name: '晋升晋级',
				show: auth[195],
				route: '/hr/employee/rank',
				children: [
					{
						name: '级称体系',
						show: auth[229],
						route: '/hr/employee/rank/promo'
					},
					{
						name: '称号体系',
						show: auth[230],
						route: '/hr/employee/rank/title'
					},
					{
						name: '晋升体系',
						show: auth[842],
						route: '/hr/employee/rank/up'
					},
					{
						name: '人才统计',
						show: auth[854],
						route: '/hr/employee/rank/statistics'
					}
				]
			},
			{
				name: '积分学分',
				show: auth[858],
				route: '/hr/employee/score',
				children: [
					{
						name: '积分体系',
						show: auth[859],
						route: '/hr/employee/score/integration'
					},
					{
						name: '学分体系',
						show: auth[873],
						route: '/hr/employee/score/credit'
					},
					{
						name: '服务审核',
						show: auth[887],
						route: '/hr/employee/score/service/examine'
					},
					{
						name: '服务申诉',
						show: auth[898],
						route: '/hr/employee/score/service/complaints'
					}
				]
			},
			{
				name: '员工考勤',
				show: auth[902],
				route: '/hr/employee/check',
			},
			{
				name: '师徒管理',
				show: auth[908],
				route: '/hr/employee/mentor',
				children: [
					{
						name: '师傅评选',
						show: auth[909],
						route: '/hr/employee/mentor/select'
					},
					{
						name: '师徒关系',
						show: auth[917],
						route: '/hr/employee/mentor/relation'
					},
					{
						name: '评选规则',
						show: auth[923],
						route: '/hr/employee/mentor/rule'
					}
				]
			},
			{
				name: '数据分析',
				show: auth[196],
				route: '/hr/employee/data',
				children: [
					{
						name: '基础数据',
						show: auth[239],
						route: '/hr/employee/data/basic',
					},
					{
						name: '员工数据',
						show: auth[240],
						route: '/hr/employee/data/emdata',
					},
					{
						name: '政委数据',
						show: auth[924],
						route: '/hr/employee/data/commissar',
					}
				]
			}
		]
	},
	{
		name: '薪资补贴',
		icon: 'icon-wallet',
		show: auth[129],
		route: '/hr/salary',
		children: [
			{
				name: '员工薪资',
				show: auth[241],
				route: '/hr/salary/wage',
				children: [
					{
						name: '每月薪资',
						show: auth[245],
						route: '/hr/salary/wage/monthly',
					},
					{
						name: '调整历史',
						show: auth[246],
						route: '/hr/salary/wage/history',
					}
				]
			},
			{
				name: '员工补贴',
				show: auth[242],
				route: '/hr/salary/subsidy',
				children: [
					{
						name: '交通补贴',
						show: auth[249],
						route: '/hr/salary/subsidy/traffic',
					}
				]
			},
			{
				name: '社保管理',
				show: auth[1129],
				route: '/hr/salary/social',
				children: [
					{
						name: '社保补贴',
						show: auth[1130],
						route: '/hr/salary/social/subsidy',
					},
					{
						name: '历史数据',
						show: auth[1136],
						route: '/hr/salary/social/history',
					},
					{
						name: '社保设置',
						show: auth[1138],
						route: '/hr/salary/social/setting',
					}
				]
			},
			{
				name: '底薪设置',
				show: auth[243],
				route: '/hr/salary/base'
			},
			{
				name: '提成设置',
				show: auth[244],
				route: '/hr/salary/per'
			},
			{
				name: '团队提成',
				show: auth[1139],
				route: '/hr/salary/team'
			}
		]
	},
	// {
	// 	name: '三立学府',
	// 	icon: 'icon-shaokexuefushanggangpeixunxiaoshu',
	// 	show: auth[925],
	// 	route: '/hr/academy',
	// 	children: [
	// 		{
	// 			name: '新人输送',
	// 			show: auth[926],
	// 			route: '/hr/academy/transfer',
	// 			children: [
	// 				{
	// 					name: '新人输送',
	// 					show: auth[927],
	// 					route: '/hr/academy/transfer/transfer',
	// 				},
	// 				{
	// 					name: '数据统计',
	// 					show: auth[938],
	// 					route: '/hr/academy/transfer/statistic',
	// 				}
	// 			]
	// 		},
	// 		{
	// 			name: '培训中心',
	// 			show: auth[954],
	// 			route: '/hr/academy/train',
	// 			children: [
	// 				{
	// 					name: '课程表',
	// 					show: auth[955],
	// 					route: '/hr/academy/train/schedule',
	// 				},
	// 				{
	// 					name: '培训安排',
	// 					show: auth[971],
	// 					route: '/hr/academy/train/arrangement',
	// 				}
	// 			]
	// 		},
	// 		{
	// 			name: '课程中心',
	// 			show: auth[1036],
	// 			route: '/hr/academy/course',
	// 			children: [
	// 				{
	// 					name: '课程库',
	// 					show: auth[1037],
	// 					route: '/hr/academy/course/store',
	// 				},
	// 				{
	// 					name: '题库',
	// 					show: auth[1048],
	// 					route: '/hr/academy/course/question',
	// 				},
	// 				{
	// 					name: '试卷库',
	// 					show: auth[1062],
	// 					route: '/hr/academy/course/paper',
	// 				}
	// 			]
	// 		},
	// 		{
	// 			name: '统计中心',
	// 			show: auth[1076],
	// 			route: '/hr/academy/statistic',
	// 			children: [
	// 				{
	// 					name: '学员学习记录',
	// 					show: auth[1077],
	// 					route: '/hr/academy/statistic/study',
	// 				},
	// 				{
	// 					name: '培训课程记录',
	// 					show: auth[1080],
	// 					route: '/hr/academy/statistic/course',
	// 				}
	// 			]
	// 		},
	// 		{
	// 			name: '精英打造',
	// 			show: auth[1085],
	// 			route: '/hr/academy/elite',
	// 			children: [
	// 				{
	// 					name: '人才盘点',
	// 					show: auth[1086],
	// 					route: '/hr/academy/elite/talent',
	// 				},
	// 				{
	// 					name: '课题梯队设置',
	// 					show: auth[1090],
	// 					route: '/hr/academy/elite/setting',
	// 				}
	// 			]
	// 		}
	// 	]
	// },
	{
		name: '政工部',
		icon: 'icon-danganguanli',
		show: auth[1099], // auth[1099],
		route: '/hr/archives',
		children: [
			{
				name: '员工客户',
				show: auth[1100],
				route: '/hr/archives/employee',
				children: [
					{
						name: '业务跟踪',
						show: auth[1101],
						route: '/hr/archives/employee/business',
					},
					{
						name: '成交客户',
						show: auth[1110],
						route: '/hr/archives/employee/customer',
					}
					// {
					// 	name: '目标跟进',
					// 	show: auth[1114],
					// 	route: '/hr/archives/employee/target',
					// }
				]
			},
			{
				name: '业绩统计',
				show: auth[1118],
				route: '/hr/archives/achie',
				children: [
					{
						name: '业绩排名',
						show: auth[1119],
						route: '/hr/archives/achie/rank',
					},
					{
						name: 'PK情况',
						show: auth[1121],
						route: '/hr/archives/achie/pk',
					},
					{
						name: '趋势分析',
						show: auth[1039],
						route: '/hr/archives/achie/trend',
					}
				]
			},
			{
				name: '人员档案',
				show: auth[1125],
				route: '/hr/archives/person',
			},
			{
				name: '业务审核',
				show: auth[1671],
				route: '/hr/archives/audit',
			}
		]
	},
	{
		name: '系统设置',
		icon: 'icon-system',
		show: auth[1144],
		route: '/hr/system',
		children: [
			{
				name: '组织架构',
				show: auth[232],
				route: '/hr/system/organization'
			},
			{
				name: '职位设置',
				show: auth[133],
				route: '/hr/system/position'
			},
			{
				name: '考核机制',
				show: auth[1146],
				route: '/hr/system/assess',
				children: [
					{
						name: '晋级设置',
						show: auth[134],
						route: '/hr/system/assess/rank'
					},
					{
						name: '晋升设置',
						show: auth[1147],
						route: '/hr/system/assess/up'
					},
					{
						name: '积分设置',
						show: auth[1151],
						route: '/hr/system/assess/integration'
					},
					{
						name: '学分设置',
						show: auth[1169],
						route: '/hr/system/assess/credit'
					},
					{
						name: '数据配置',
						show: auth[1183],
						route: '/hr/system/assess/statistics'
					}
				]
			},
			{
				name: '角色管理',
				show: auth[131],
				route: '/hr/system/role'
			}
		]
	},
	// {
	// 	name: '组织架构',
	// 	icon: 'icon-department',
	// 	show: auth[132],
	// 	route: '/hr/organization'
	// },
	// {
	// 	name: '职位设置',
	// 	icon: 'icon-equipment',
	// 	show: auth[133],
	// 	route: '/hr/position'
	// },
	// {
	// 	name: '级称设置',
	// 	icon: 'icon-zuanshi',
	// 	show: auth[134],
	// 	route: '/hr/rank'
	// },
	// {
	// 	name: '服务积分',
	// 	icon: 'icon-integral-shop',
	// 	show: auth[130],
	// 	route: '/hr/points',
	// 	children: [
	// 		{
	// 			name: '积分确认',
	// 			show: auth[260],
	// 			route: '/hr/points/confirm',
	// 		},
	// 		{
	// 			name: '投诉记录',
	// 			show: auth[265],
	// 			route: '/hr/points/complaint',
	// 		}
	// 	]
	// },
	{
		name: '工具管理',
		icon: 'icon-tool1',
		show: auth[135],
		route: '/hr/tool',
		children: [
			{
				name: '流程管理',
				show: auth[284],
				route: '/hr/tool/workflow',
			},
			{
				name: '模块管理',
				show: auth[287],
				route: '/hr/tool/modules',
				children: [
					{
						name: 'Offer附件',
						show: auth[288],
						route: '/hr/tool/modules/offer',
					},
					{
						name: 'Offer正文',
						show: auth[1744],
						route: '/hr/tool/modules/upload',
					}
				]
			}
		]
	}
];
