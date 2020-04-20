export default {
	data() {
		const validateNumber = (rule, value, callback) => {
			let reg = /^[0-9]*$/;
			if (reg.test(value)) {
				callback();
			} else {
				callback(new Error('请输入数字'));
			}
		};
		return {
			lectureVal: true,
			teacher: 'teacher',
			options: {
				disabledDate(date) {
					return date && date.valueOf() < Date.now() - 86400000;
				}
			},
			remote: null,
			formData: {
				course_name: '', // 课程名称
				lecture: [], // 授课讲师
				course_type: '', // 课程类型
				echelon: {
					condition_name: '',
					condition_participator: [],
					organize_name: '',
					organize_participator: []
				}, // 参与人员
				organizer_depart_id: [], // 举办方
				course_time: '', // 课程时长
				use: 4, // 用途
				time: [], // 授课时间
				address: '', // 授课地点
				depart_id: [], // 授课部门
				attachment: [], // 课件
				condition: {}, // 设置条件
			},
			teacherList: [],
			teachersSearchLoading: false,
			echelonData: [], // 人才梯队数据
			rules: {
				course_name: [{ required: true, message: '请输入课程名称', trigger: 'change' },
					{ required: true, message: '请输入课程名称', trigger: 'blur' }], // 课程名称
				course_time: [{ validator: validateNumber, trigger: 'blur' }],
			}
		};
	},
};