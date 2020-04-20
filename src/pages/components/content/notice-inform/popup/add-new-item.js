
export default {
	data() {
		return {
			is_all: 0,
			formValidate: {
				notice_type: 1,
				wait_time: 3,
				title: '',
				content: '',
				send_type: '',
				start_time: '',
				end_time: '',
				notice_role: []
			},
			ruleValidate: {
				notice_type: [
					{ required: true, type: 'number', message: '请选择类型', trigger: 'change' }
				],
				title: [
					{ required: true, message: '请输入标题', trigger: 'change' }
				],
				content: [
					{ required: true, message: '请输入通知内容', trigger: 'change' }
				],
				send_type: [
					{ required: true, type: 'number', message: '选择发送类型', trigger: 'change' }
				],
				start_time: [
					{ required: true, type: 'date', message: '请选择开始时间', trigger: 'change' }
				],
				end_time: [
					{ required: true, type: 'date', message: '请选择开始时间', trigger: 'change' }
				],
				notice_role: [
					{ required: true, type: 'array', message: '至少选择一个角色', trigger: 'change' }
				]
			}
		};
	},
	methods: {
		handleReset(name) {
			this.$refs[name].resetFields();
		}
	}
};