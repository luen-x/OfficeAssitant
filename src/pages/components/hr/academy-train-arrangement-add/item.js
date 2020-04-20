export default {
	data() {
		// const validateAttendsMembers1 = (rule, value, callback) => {
		// 	if (this.formData.echelon.participant_type.includes(1)
		// 		&& this.formData.echelon.attend_members1.length < 1) {
		// 		callback(new Error('请选择人才梯队'));
		// 	} else {
		// 		callback();
		// 	}
		// };
		// const validateAttendsMembers2 = (rule, value, callback) => {
		// 	if (this.formData.echelon.participant_type.includes(2)
		// 		&& this.formData.echelon.attend_members2 == '') {
		// 		callback(new Error('请输入参与人员分类名称'));
		// 	} else {
		// 		callback();
		// 	}
		// };
		// const validateAttendsMembersData = (rule, value, callback) => {
		// 	if (this.formData.echelon.participant_type.includes(2)
		// 		&& this.formData.echelon.attend_members2_data.length < 1) {
		// 		callback(new Error('请添加参与人员'));
		// 	} else {
		// 		callback();
		// 	}
		// };
		const validateMethodName = (rule, value, callback) => {
			let reg = /^[A-Za-z0-9\u4e00-\u9fa5]+$/;
			if (this.formData.teach_method.method 
				== '7' && this.formData.teach_method.method_name == '') {
				callback(new Error('请输入其他授课方式名称'));
			} else if (this.formData.teach_method.method 
				== '7' && !reg.test(value)) {
				callback(new Error('请输入汉字、英文或者数字'));
			} else {
				callback();
			}
		};
		const validateVideoMethod = (rule, value, callback) => {
			if (this.formData.teach_method.method 
				== '6' && this.formData.teach_method.video_method == '') {
				callback(new Error('请选择视频快进方式'));
			} else {
				callback();
			}
		};
		const validateCourseCode = (rule, value, callback) => {
			let reg = /^[0-9a-zA-Z]+$/;
			if (reg.test(value)) {
				callback();
			} else if (value == '') {
				callback();
			} else {
				callback(new Error('请输入英文或数字'));
			}
		};
		const validateNumber = (rule, value, callback) => {
			let reg = /^[0-9]*$/;
			if (reg.test(value)) {
				callback();
			} else if (value == '') {
				callback();
			} else {
				callback(new Error('请输入数字'));
			}
		};
		const validateScheduleId = (rule, value, callback) => {
			if (this.formData.schedule.schedule_type 
				== 2 && this.formData.schedule.schedule_depart_id.length == 0) {
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
				course_code: '', // 课程编码
				lecture: [], // 授课讲师
				lecture_type: 3, // 授课讲师类型
				course_type: '', // 课程类型
				echelon: {
					participant_type: [],
					attend_members1: [],
					attend_members2: '',
					attend_members2_data: []
				}, // 参与人员
				teach_method: {
					method: '',
					method_name: '',
					video_method: 1
				}, // 授课方式
				subject: [], // 关联课题
				organizer_depart_id: [], // 举办方
				course_time: '', // 课程时长
				use: 1, // 用途
				time: [], // 授课时间
				position: '', // 授课地点
				schedule: {
					schedule_depart_id: [],
					schedule_type: 0,
				}, // 同步到课程表
				teach_depart_id: [], // 授课部门
				attachment: [], // 课件
				is_save_course: 0, // 保存到课程库
			},
			teacherList: [],
			teachersSearchLoading: false,
			echelonData: [], // 人才梯队数据
			rules: {
				course_name: [{ required: true, message: '请输入课程名称', trigger: 'change' },
					{ required: true, message: '请输入课程名称', trigger: 'blur' }], // 课程名称
				course_code: [{ validator: validateCourseCode, trigger: 'blur' }],
				lecture: [{ type: 'array', required: true, message: '请选择讲师', trigger: 'change' }],
				lecture_type: [{ required: true, message: '请选择讲师类型', trigger: 'change' }], // 授课讲师
				course_time: [{ validator: validateNumber, trigger: 'blur' }],
				course_type: [{ required: true, type: 'number', message: '请选择课程类型', trigger: 'change' }], // 课程类型
				echelon: [{
					type: 'object',
					required: true,
					fields: {
						// participant_type: [{ required: true, type: 'array', message: '至少勾选一种参与人员', trigger: 'change' }],
						// attend_members1: [{ validator: validateAttendsMembers1, trigger: 'change' }],
						// attend_members2: [{ validator: validateAttendsMembers2, trigger: 'blur' }],
						// attend_members2_data: [{ validator: validateAttendsMembersData, trigger: 'change' }]
					}
				}], // 参与人员
				teach_method: [{
					type: 'object',
					required: true,
					fields: {
						method: [{ required: true, type: 'number', message: '请选择授课方式', trigger: 'change' }],
						method_name: [{ validator: validateMethodName, trigger: 'blur' }],
						video_method: [{ validator: validateVideoMethod, trigger: 'change' }]
					}
				}], // 授课方式
				subject: [{ type: 'array', required: true, message: '请选择关联课题', trigger: 'change' }], // 关联课题
				organizer_depart_id: [{ type: 'array', required: true, message: '请选择举办方', trigger: 'change' }], // 举办方
				time: [{
					type: 'array',
					required: true,
					fields: {
						0: { type: 'date', required: true, message: '请选择授课时间' },
						1: [{ type: 'date', required: true, message: '请选择授课时间' }
						],
					}
				}],
				position: [{ required: true, message: '请输入授课地点', trigger: 'blur' }], // 授课地点
				teach_depart_id: [{ type: 'array', required: true, message: '请输入授课部门', trigger: 'change' }], // 授课部门
				schedule: [{
					type: 'object',
					required: true,
					fields: {
						schedule_depart_id: [{ validator: validateScheduleId, trigger: 'change' }],
					}
				}]
			}
		};
	},
	methods: {
	}
};