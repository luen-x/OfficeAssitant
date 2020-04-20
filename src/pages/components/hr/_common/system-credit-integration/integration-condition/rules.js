export default {
	data() {
		const positiveRule = [
			{ required: true, type: 'number', message: '请输入数字', trigger: 'blur' }
		];
		const StringRule = [
			{ required: true, message: '请输入数字', trigger: 'blur' }
		];
		return {
			validator: {	
				start_month: [
					{ required: true, type: 'date', message: '请选择开始月份', trigger: 'change' }
				],
				cycle_month: [
					{ required: true, type: 'array', message: '请选择周期', trigger: 'change' }
				],
				rank_system_type: [
					{ required: true, type: 'number', message: '请选择级称体系', trigger: 'change' }
				],
				integral_type: [
					{ required: true, type: 'number', message: '请选择积分类型', trigger: 'change' }
				],
				master_type: [
					{ required: true, type: 'number', message: '请选择师傅类型', trigger: 'change' }
				],
				education: [
					{ required: true, type: 'number', message: '请选择知识水平', trigger: 'change' }
				],
				position_id: [
					{ required: true, type: 'number', message: '请选择职位', trigger: 'change' }
				],
				target_type: [
					{ required: true, type: 'number', message: '请选择业绩目标', trigger: 'change' }
				],
				rank_id: [
					{ required: true, type: 'number', message: '请选择级称', trigger: 'change' }
				],
				performance: StringRule,
				standing_from: positiveRule,
				standing_to: positiveRule,
				position_month: positiveRule,
				performance_rank_from: positiveRule,
				performance_rank_to: positiveRule,
				point: positiveRule,
				continue_times: positiveRule,
				performance_from: positiveRule,
				performance_to: [
					{ 
						required: true, 
						validator(rule, value, call) {
							if (!value) {
								call(new Error('业绩不能为空'));
							} else {
								call();
							}
						} 
					}
				],
				integral_rank_from: positiveRule,
				integral_rank_to: positiveRule,
				apprentice_standing_month: positiveRule,
				apprentice_num_from: positiveRule,
				apprentice_num_to: positiveRule,
				position_year: positiveRule,
				absence_time_from: positiveRule,
				absence_time_to: positiveRule,
				average_integral_from: positiveRule,
				average_integral_to: positiveRule,
			}
		};
	}
};