export default {
	data() {
		return {
			formValidate: {
				project_id: '',
				vote_topic: '',
				relation_type: '',
				relation_id: [],
				relation_course: [],
				vote_describe: '',
				expand: false,
				vote_items: [],
				label: ''
			},
			ruleValidate: {
				vote_topic: [
					{ required: true, message: '请填写投票名称', trigger: 'blur' }
				],
				content: [
					{ required: true, message: '请填写正确信息', trigger: 'blur' }
				]
			}
		};
	}
};