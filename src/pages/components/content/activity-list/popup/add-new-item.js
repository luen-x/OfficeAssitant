const validateTime = (rule, value, callback) => {
	if (!value[0] && !value[1]) {
		callback('请选择开始时间');
	} else {
		callback();
	}   
};
// 校验活动报名时间  报名结束时间大于当前时间
const validateStartTime = (rule, value, callback) => {
	if (!value[0] && !value[1]) {
		callback('请选择开始时间');
	} else if (Number(value[1] < (new Date()).valueOf())) {
		callback('报名结束时间应大于当前时间');
	} else {
		callback();
	}
};
const validateCreatedTime = (rule, value, callback) => {
	if (!value[0] && !value[1]) {
		callback('请选择开始时间');
	} else {
		callback();
	}
};
const validateLength = length => (rule, value, callback) => {
	if (value.length > length) {
		callback(`请输入${length}字以内`);
	} else {
		callback();
	}   
};
export default {
	data() {
		return {
			formValidate: {
				activity_name: '',
				category_id: '',
				createdTime: '', // 活动时间
				startTime: '', // 报名时间
				address: '',
				has_voucher: 1,
				show_apply_num: 1,
				write_retrain_num: 1,
				write_listen_finish: 1,
				write_category: 1,
				write_join_strategy: 1,
				write_lift_plate: 1,
				write_is_renew: 0,
				apply_limit: '',
				extra_apply: '',
				customer_type: [],
				coverImage: [],
				describe: '',
				write_proxy_num: 1
			},
			ruleValidate: {
				activity_name: [
					{ required: true, message: '请填写活动名称', trigger: 'change' },
					{ validator: validateLength(30), trigger: 'change', required: true }
				],
				category_id: [
					{ required: true, type: 'number', message: '请选择活动分类', trigger: 'change' }
				],
				createdTime: [
					// { required: true, message: '请选择正确日期', trigger: 'change' },
					{ validator: validateCreatedTime, trigger: 'change', required: true, }
				],
				startTime: [
					{ validator: validateStartTime, trigger: 'change', required: true, }
					// { required: true, type: 'object', message: '请选择开始时间', trigger: 'change' }
				],
				address: [
					{ required: false, message: '请输入50字以内', trigger: 'blur' },
					{ validator: validateLength(50), trigger: 'change', required: true }
				],
				has_voucher: [
					{ required: true, type: 'number', message: '请填写正确信息', trigger: 'change' }
				],
				show_apply_num: [
					{ required: true, type: 'number', message: '请填写正确信息', trigger: 'change' }
				],
				write_retrain_num: [
					{ required: true, type: 'number', message: '请填写正确信息', trigger: 'change' }
				],
				write_listen_finish: [
					{ required: true, type: 'number', message: '请填写正确信息', trigger: 'change' }
				],
				write_join_strategy: [
					{ required: true, type: 'number', message: '请填写正确信息', trigger: 'change' }
				],
				write_lift_plate: [
					{ required: true, type: 'number', message: '请填写正确信息', trigger: 'change' }
				],
				// , attendType: [
				// 	{ required: true, type: 'number', message: '请填写正确信息', trigger: 'change' }
				// ],
				write_category: [
					{ required: true, type: 'number', message: '请填写正确信息', trigger: 'change' }
				],
				apply_limit: [
					{ required: true, type: 'number', message: '请选择每家限制人数', trigger: 'change' }
				],
				customer_type: [
					{ required: true, type: 'array', min: 1, message: '请选择可报名客户类型', trigger: 'change' }
					// { type: 'array', max: 3, message: '最多选两个且至少选一个', trigger: 'change' }
				],
				extra_apply: [
					{ required: true, type: 'number', message: '请选择可多报名人数', trigger: 'change' }
				],
				write_proxy_num: [
					{ required: true, type: 'number', trigger: 'change' }
				],
				write_is_renew: [
					{ required: true, type: 'number', trigger: 'change' }
				],
				coverImage: [
					{ required: true, type: 'array', message: '请上传封面', trigger: 'change' }
				]
			}
		};
	}
};