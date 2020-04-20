export default {
	data() {
		return {
			addComplaintData: {
				method: '',
				time: '',
				name: '',
				cPersen: [],
				cPart: [],
				content: '',
				uploadList: [],
			},
			cpercenLoading: false,
			cpartLoading: false,
			complaintRule: {
				method: [
					{ required: true, message: '投诉方式不能为空', trigger: 'change' }
				],
				time: [
					{ required: true, type: 'date', message: '投诉时间不能为空', trigger: 'change' }
				],
				name: [
					{ required: true, message: '证明人姓名不能为空', trigger: 'blur' },
					{ max: 12, message: '证明人姓名不能超过12个字', trigger: 'blur' }
				],
				cPersen: [
					// { required: true, type: "array", message: '投诉员工不能为空', trigger: 'change' },
					{ type: 'array', max: 5, message: '投诉员工最多选择5个', trigger: 'change' }
				],
				cPart: [
					// { required: true, type: "array", message: '投诉部门不能为空', trigger: 'change' }
					{ type: 'array', max: 5, message: '投诉部门最多选择5个', trigger: 'change' }
				],
				content: [
					{ required: true, message: '投诉内容不能为空', trigger: 'blur' }
				],
				uploadList: [
					{ required: true, type: "array", message: '凭证不能为空', trigger: 'change' }
				]
			},
			complainMethodList: [
				{
					id: '1',
					name: '微信投诉',
				},
				{
					id: '2',
					name: '电话投诉',
				},
				{
					id: '3',
					name: '跑到办公室投诉',
				},
				{
					id: '4',
					name: '客户对外负面传播',
				},
				{
					id: '5',
					name: '其他',
				}
			],
			complaintPerList: [],
			complaintPartList: [],
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('SC_SERVICE_QUALITY_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('SC_SERVICE_QUALITY_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
	}
};