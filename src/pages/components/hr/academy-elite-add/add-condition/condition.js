export const beforeConditions = [
	{
		title: '工龄范围',
		label: '（当前工龄要求，精确到月）',
		value: 0
	},
	{
		title: '职位',
		label: '（当前职位要求）',
		value: 1
	},
	{
		title: '累计业绩范围',
		label: '（累计N个月内的业绩在最大值和最小值的规定额内）',
		value: 2
	},
	{
		title: '累计业绩最小值',
		label: '（累计N个月内的业绩要达到规定额）',
		value: 3
	},
	{
		title: '所在部门平均总业绩',
		label: '（规定时间段内所处部门平均每人最低总业绩达到规定额）',
		value: 4
	},
	{
		title: '所在部门平均每月业绩',
		label: '（规定时间段内所处部门平均每人每月最低业绩达到规定额）',
		value: 5
	},
	{
		title: '工龄最小值',
		label: '（当前工龄要求，精确到月）',
		value: 6
	}
];

/**
 * 索引： 条件几的索引， 后端从1开始，前端从零开始 敲黑板！！！
 * key: 后端对应的接口字段
 * desc：为填写表单中以及展示条件的描述，每两个之间 嵌入一个condition-form组件
 * showText: 显示条件是的文字
 * config： 传递给表单的自定义配置
 */
export const afterCondition = {
	'0': {
		desc: ['工龄在', '~', '个月（包含最大值）。'],
		showText: ['工龄在', '~', '个月（包含', '个月）。'],
		key: ['work_year_min', 'work_year_max', 'work_year_max'],
		config: [
			{ type: 1, option: { min: 0, precision: 0, max: 999 } },
			{ type: 1, placeholder: '输入最大值（整数）', option: { min: 0, precision: 0, max: 999 } }
		] },
	'1': {
		desc: ['当前所处', '（多选）'],
		showText: ['当前所处', '。'],
		key: ['positions'], // 这里做了转化， 后端给的是id， 转化成对应职位
		config: [
			{ type: 2 }
		]
	},
	'2': {
		desc: ['累计', '的业绩最小值', '元，且业绩最大值', '元（包含最大值）。'],
		showText: ['累计', '的业绩最小值', '元，且业绩最大值', '元（包含', '元）。'],
		key: ['cumulative_months', 'achievement_min', 'achievement_max', 'achievement_max'],
		config: [
			{ type: 3 },
			{ type: 1, placeholder: '输入金额' },
			{ type: 1, placeholder: '输入金额' }
		]
	},
	'3': {
		desc: ['累计', '业绩不低于', '元。'],
		showText: ['累计', '业绩不低于', '元。'],
		key: ['cumulative_months', 'achievement_min'],
		config: [
			{ type: 3 },
			{ type: 1, placeholder: '输入金额' }
		]
	},
	'4': {
		desc: ['累计', '所在部门平均每人总业绩不低于', '元。'],
		showText: ['累计', '所在部门平均每人总业绩不低于', '元。'],
		key: ['cumulative_months', 'achievement_avg'],
		config: [
			{ type: 3 },
			{ type: 1, placeholder: '输入金额' }
		]
	},
	'5': {
		desc: ['累计', '所在部门平均每人每月业绩不低于', '元。'],
		showText: ['累计', '所在部门平均每人每月业绩不低于', '元。'],
		key: ['cumulative_months', 'achievement_avg_month'],
		config: [
			{ type: 3 },
			{ type: 1, placeholder: '输入金额' }
		]
	},
	'6': {
		desc: ['工龄不低于', '个月。'],
		showText: ['工龄不低于', '个月。'],
		key: ['work_year_min'],
		config: [
			{ type: 1, placeholder: '输入数字（整数）', option: { min: 0, precision: 0, max: 999 } }
		]
	}
};