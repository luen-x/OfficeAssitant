export default {
	data() {
		const isPositive = ['1', '2', '5', '7', '9', '10'].some(item => item === this.id);
		return {
			validator: {
				display_text: [
					{ required: true, message: '请输入提示信息', trigger: 'blur' }
				],
				evaluate_month: [
					{ required: true, type: 'number', message: '请选择期限', trigger: 'change' }
				],
				range: [
					{ required: true, type: 'number', message: '请选择范围', trigger: 'change' }
				],
				object: [
					{ required: true, type: 'number', message: '请选择对象', trigger: 'change' }
				],
				unpass_deadline: [
					{ required: true, type: 'number', message: '请选择期限', trigger: 'blur' }
				],
				pass_percent: [
					{ required: true, type: 'number', message: '请输入百分比', trigger: 'blur' }
				],
				credit_rank_from: [
					{ required: true, type: 'number', message: '请输入数字', trigger: 'blur' }
				],
				credit_rank_to: [
					{ required: true, type: 'number', message: '请输入数字', trigger: 'blur' }
				],
				audit_type: [
					{ required: true, message: '请输入审核类型', trigger: 'blur' }
				],
				percent_type: [
					{ required: true, type: 'number', message: '请选择大小', trigger: 'change' }
				],
				material_use: [
					{ required: true, type: 'number', message: '请选择素材用途', trigger: 'change' }
				],
				material_person_type: [
					{ required: true, type: 'number', message: '请选择用户', trigger: 'change' }
				],
				start_month: [
					{ required: true, type: 'date', message: '请选择基准期', trigger: 'change' }
				],
				point: [
					{ 
						required: true,
						type: 'number',
						message: isPositive ? '请输入数字' : '请输入负数', 
						trigger: 'blur', 
					}
				],
			}
		};
	}
};