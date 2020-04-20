export default {
	data() {
		return {
			formData: {
				material_use: '',
				provider_ids: [],
				describe: '',
				tape_material_name: '',
				tape_date: '',
				tape_person_id: '',
				customer_info: '',
				base_situation: [],
				customer_product: '',
				negotiator_id: '',
				communicate_place: '',
				communicate_result: '',
				operation_flow: '',
				customer_problem: '',
				colleague_do: '',
				chief_prosecutor_id: '',
				train_theme: '',
				train_program: '',
				train_object: '',
				company_type: '',
				advisory_information: '',
				reservation_purpose: '',
				customer_stage: '',
				content_validity: '',
				belong_plate: ''
			},
			rules: {
				material_use: [{ required: true, type: "number", message: "请选择素材用途", trigger: "change" }],
				provider_ids: [{ required: true, type: "array", message: "素材提供者不能为空", trigger: "change" }],
				tape_material_name: [{ required: true, message: "素材名称不能为空", trigger: "blur" }],
				tape_date: [{ required: true, type: "date", message: '请选择录音日期', trigger: 'change' }],
				tape_person_id: [{ required: true, type: "number", message: '录音者不能为空', trigger: 'change' }],
				customer_info: [{ required: true, message: '客户信息不能为空', trigger: 'blur' }],
				base_situation: [{ required: true, type: 'array', message: '请勾选客户基本情况', trigger: 'change' }],
				customer_product: [{ required: true, message: '客户产品不能为空', trigger: 'blur' }],
				negotiator_id: [{ required: true, type: "number", message: '谈判手不能为空', trigger: 'change' }],
				communicate_place: [{ required: true, message: '沟通地点不能为空', trigger: 'blur' }],
				communicate_result: [{ required: true, message: '沟通结果不能为空', trigger: 'blur' }],
				operation_flow: [{ required: true, message: '业务流程不能为空', trigger: 'blur' }],
				customer_problem: [{ required: true, message: '沟通前客户存在问题不能为空', trigger: 'blur' }],
				colleague_do: [{ required: true, message: '面谈前同事做了什么不能为空', trigger: 'blur' }],
				chief_prosecutor_id: [{ required: true, type: "number", message: '主述人不能为空', trigger: 'change' }],
				train_theme: [{ required: true, message: '培训主题不能为空', trigger: 'blur' }],
				train_program: [{ required: true, message: '培训大纲不能为空', trigger: 'blur' }],
				train_object: [{ required: true, message: '培训对象不能为空', trigger: 'blur' }],
				company_type: [{ required: true, type: "number", message: '请选择客户公司类型', trigger: 'change' }],
				advisory_information: [{ required: true, message: '咨询信息不能为空', trigger: 'blur' }],
				reservation_purpose: [{ required: true, message: '预约目的不能为空', trigger: 'blur' }],
				customer_stage: [{ required: true, message: '客户所处阶段不能为空', trigger: 'blur' }],
				content_validity: [{ required: true, message: '内容简介不能为空', trigger: 'blur' }],
				belong_plate: [{ required: true, type: "number", message: '请选择所属模块', trigger: 'change' }]
			}
		};
	}
};