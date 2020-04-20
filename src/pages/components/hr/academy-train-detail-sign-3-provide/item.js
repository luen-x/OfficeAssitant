export default {
	data() {
		const validateIn = (rule, value, callback) => {
			if (this.formData.in_show_info.includes(1) && value == '') {
				callback(new Error('请输入开场签到提示'));
			} else {
				callback();
			}
		};
		const validateBack = (rule, value, callback) => {
			if (this.formData.back_show_info.includes(1) && value == '') {
				callback(new Error('请输入离场签退提示'));
			} else {
				callback();
			}
		};
		const validateInTime = (rule, value, callback) => {
			if (!value[0] && !value[1]) {
				callback('请选择开场签到时间');
			} else {
				callback();
			}
		};
		const validateBackTime = (rule, value, callback) => {
			if (!value[0] && !value[1]) {
				callback('请选择离场签退时间');
			} else {
				callback();
			}
		};
		return {
			formData: {
				in_time: [],
				back_time: [],
				sign_limit: 1,
				verify_items: [1, 2],
				in_show_info: [2],
				in_notice_tips: '',
				back_show_info: [],
				back_notice_tips: '',
				late_time: '20',
			},
			formRule: {
				in_time: { validator: validateInTime, trigger: 'change', required: true, },
				back_time: { validator: validateBackTime, trigger: 'change', required: true, },
				sign_limit: [{ required: true, type: "number", message: '请选择限定人员范围', trigger: 'change' }],
				in_notice_tips: [{ validator: validateIn, trigger: 'blur' }],
				back_notice_tips: [{ validator: validateBack, trigger: 'blur' }],
				late_time: [
					{ required: true, message: '请选择迟到时间范围', trigger: 'change' }],
			},
			timeList: [
				{
					label: '5分钟',
					value: '5'
				}, {
					label: '10分钟',
					value: '10'
				}, {
					label: '15分钟',
					value: '15'
				}, {
					label: '20分钟',
					value: '20'
				}, {
					label: '25分钟',
					value: '25'
				}, {
					label: '30分钟',
					value: '30'
				}, {
					label: '1小时',
					value: '60'
				}, {
					label: '2小时',
					value: '120'
				}, {
					label: '3小时',
					value: '180'
				}, {
					label: '4小时',
					value: '240'
				}
			]
		};
	}
};