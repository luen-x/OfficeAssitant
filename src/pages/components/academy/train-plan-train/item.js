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
		const validateDepart = (rule, value, callback) => {
			if (this.sync_type
				== 3 && !this.formData.course_depart_id) {
				callback(new Error('请选择战区'));
			} else {
				callback();
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
				sync_type: 2, // 同步课程表
				course_depart_id: null, // 事业部
				is_sync: 0, // 课程支持
			},
			teacherList: [],
			teachersSearchLoading: false,
			echelonData: [], // 人才梯队数据
			rules: {
				course_name: [{ required: true, message: '请输入课程名称', trigger: 'change' },
					{ required: true, message: '请输入课程名称', trigger: 'blur' }], // 课程名称
				course_time: [{ validator: validateNumber, trigger: 'blur' }],
				sync_type: [{ type: 'number', required: true, message: '请选择是否同步课程表', trigger: 'change' }],
				lecture: [{ type: 'array', required: true, message: '请选择讲师', trigger: 'change' }],
				address: [{ required: true, message: '请输入授课地点', trigger: 'blur' }], // 授课地点
				time: [{
					type: 'array',
					required: true,
					fields: {
						0: { type: 'date', required: true, message: '请选择授课时间' },
						1: [{ type: 'date', required: true, message: '请选择授课时间' }
						],
					}
				}],
				depart_id: [{ type: 'array', required: true, message: '请选择授课部门', trigger: 'change' }],
				organizer_depart_id: [{ type: 'array', required: true, message: '请选择举办方', trigger: 'change' }],
				is_sync: [{ required: true, type: 'number', message: '请选择同步课程支持', trigger: 'change' }],
				course_depart_id: [{ validator: validateDepart, trigger: 'change' }],
			}
		};
	},
};