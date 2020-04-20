const talks = [
	{
		label: '素材名称',
		value: 'tape_material_name'
	},
	{
		label: '录音日期',
		value: 'tape_date'
	},
	{
		label: '录音者',
		value: 'tape_person'
	},
	{
		label: '客户信息',
		value: 'customer_info'
	},
	{
		label: '客户基本情况',
		value: 'base_situation_name'
	},
	{
		label: '客户产品',
		value: 'customer_product'
	},
	{
		label: '谈判手',
		value: 'negotiator'
	},
	{
		label: '沟通地点',
		value: 'communicate_place'
	},
	{
		label: '沟通结果',
		value: 'communicate_result'
	},
	{
		label: '业务流程',
		value: 'operation_flow'
	},
	{
		label: '沟通前客户存在问题',
		value: 'customer_problem'
	},
	{
		label: '面谈前同事做了什么',
		value: 'colleague_do'
	}
];

const trains = [
	{
		label: '素材名称',
		value: 'tape_material_name'
	},
	{
		label: '录音日期',
		value: 'tape_date'
	},
	{
		label: '录音者',
		value: 'tape_person'
	},
	{
		label: '主述人',
		value: 'chief_prosecutor'
	},
	{
		label: '培训主题',
		value: 'train_theme'
	},
	{
		label: '培训大纲',
		value: 'train_program'
	},
	{
		label: '培训对象',
		value: 'train_object'
	}
];

const consults = [
	{
		label: '素材名称',
		value: 'tape_material_name'
	},
	{
		label: '录音日期',
		value: 'tape_date'
	},
	{
		label: '录音者',
		value: 'tape_person'
	},
	{
		label: '客户信息',
		value: 'customer_info'
	},
	{
		label: '主述人',
		value: 'chief_prosecutor'
	},
	{
		label: '客户公司类型',
		value: 'company_type_name'
	},
	{
		label: '咨询信息',
		value: 'advisory_information'
	},
	{
		label: '预约目的',
		value: 'reservation_purpose'
	},
	{
		label: '客户所处阶段',
		value: 'customer_stage'
	}
];

const materials = [
	{
		label: '素材名称',
		value: 'tape_material_name'
	},
	{
		label: '内容简介',
		value: 'content_validity'
	},
	{
		label: '所属板块',
		value: 'belong_plate_name'
	}
];

export const getMaterialArr = (type) => {
	const obj = {
		'4': talks,
		'5': trains,
		'6': consults,
		'7': materials,
	};
	return obj[type] || [];
};