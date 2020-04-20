export const STATUS = {
	'1': { label: '待添加', color: '#ED8F4A' },
	'2': { label: '已添加', color: '#818794' },
	'3': { label: '已通过', color: '#4FC43D' },
	'4': { label: '待审核', color: '#ED8F4A' },
	'5': { label: '已驳回', color: '#E84C57' },
	'6': { label: '驳回后提交', color: '#818794' }
};

export const ROLE_ENUM = {
	'1': '流程对接人',
	'2': '协助流程对接人',
	'3': '主持人',
	'4': '讲师',
	'5': '唱单',
	'6': '音控',
};

export const POSITION_ENUM = [
	{ value: 1, label: '老板' },
	{ value: 2, label: '操盘手' },
	{ value: 3, label: '商学院院长' },
	{ value: 4, label: '董事长' },
	{ value: 5, label: '团队长' },
	{ value: 6, label: '市场总监' },
	{ value: 7, label: '创始人' },
	{ value: 8, label: '助理' }
]; 

export const onlineLeaderInfo = [
	{ label: '客户职位：', key: 'position' },
	{ label: '套系名称：', key: 'lecture_set_name' },
	{ label: '对接时间：', key: 'docking_time' },
	{ label: '备注：', key: 'remark', showAutotip: true },
	{ label: '记录时间：', key: 'update_time' }
];

export const onlineHelpLeaderInfo = [
	{ label: '上次驳回理由：', key: 'audit_remark', showAutotip: true },
	{ label: '入职时间：', key: 'entry_date' },
	{ label: '套系名称：', key: 'lecture_set_name' },
	{ label: '累计学习数：', key: 'learning_times' },
	{ label: '本次是否计数：', key: 'is_count' },
	{ label: '师傅：', key: 'master_name' },
	{ label: '对接时间：', key: 'docking_time' },
	{ label: '备注：', key: 'remark', showAutotip: true },
	{ label: '记录时间：', key: 'update_time' }
];

export const outlineLeaderInfo = [
	{ label: '课程类型：', key: 'lecture_set_name' },
	{ label: '对接时间：', key: 'docking_time' },
	{ label: '是否出差：', key: 'is_business' },
	{ label: '出差天数：', key: 'business_day' },
	{ label: '备注：', key: 'remark', showAutotip: true },
	{ label: '记录时间：', key: 'update_time' }
];

export const outlineHelpLeaderInfo = [
	{ label: '上次驳回理由：', key: 'audit_remark', showAutotip: true },
	{ label: '入职时间：', key: 'entry_date' },
	{ label: '课程类型：', key: 'lecture_set_name' },
	{ label: '累计学习数：', key: 'learning_times' },
	{ label: '本次是否计数：', key: 'is_count' },
	{ label: '师傅：', key: 'master_name' },
	{ label: '对接时间：', key: 'docking_time' },
	{ label: '是否出差：', key: 'is_business' },
	{ label: '出差天数：', key: 'business_day' },
	{ label: '备注：', key: 'remark', showAutotip: true },
	{ label: '记录时间：', key: 'update_time' }
];

export const outlineHostInfo = [
	{ label: '上次驳回理由：', key: 'audit_remark', showAutotip: true },
	{ label: '课程类型：', key: 'lecture_set_name' },
	{ label: '主持时间：', key: 'hosting_time', showAutotip: true },
	{ label: '主持人数：', key: 'staff_num' },
	{ label: '主持天数：', key: 'hosting_day' },
	{ label: '是否出差：', key: 'is_business' },
	{ label: '出差天数：', key: 'business_day' },
	{ label: '备注：', key: 'remark', showAutotip: true },
	{ label: '记录时间：', key: 'update_time' }
];

export const outlineSingInfo = [
	{ label: '上次驳回理由：', key: 'audit_remark', showAutotip: true },
	{ label: '课程类型：', key: 'lecture_set_name' },
	{ label: '唱单时间：', key: 'singing_time', showAutotip: true },
	{ label: '是否出差：', key: 'is_business' },
	{ label: '出差天数：', key: 'business_day' },
	{ label: '备注：', key: 'remark', showAutotip: true },
	{ label: '记录时间：', key: 'update_time' }
];

export const outlineSoundInfo = [
	{ label: '上次驳回理由：', key: 'audit_remark', showAutotip: true },
	{ label: '课程类型：', key: 'lecture_set_name' },
	{ label: '音控时间：', key: 'voice_time', showAutotip: true },
	{ label: '是否出差：', key: 'is_business' },
	{ label: '出差天数：', key: 'business_day' },
	{ label: '备注：', key: 'remark', showAutotip: true },
	{ label: '记录时间：', key: 'update_time' }
];