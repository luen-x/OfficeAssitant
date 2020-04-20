export default {
	data() {
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
				train_course_type: null, // 课程类型
				course_name: '', // 课程名称
				course_name_type: 1, // 课程设置
				lecture: [], // 授课讲师
				echelon: {
					condition_name: '',
					condition_participator: [],
					organize_name: '',
					organize_participator: []
				}, // 参与人员
				time: [], // 授课时间
				address: '', // 授课地点
				depart_id: [], // 授课部门
				attachment: [], // 课件
				condition: {}, // 设置条件
				sync_type: 2, // 同步课程表
				course_depart_id: null, // 事业部
				brief: '', // 参与人员说明
				memo: '', // 简介
				period: '',
			},
			teacherList: [],
			teachersSearchLoading: false,
			echelonData: [], // 人才梯队数据
			rules: {
				train_course_type: [{ required: true, type: 'number', message: '请选择课程类型', trigger: 'change' }],
				course_name: [
					{ required: true, message: '请输入课程名称', trigger: 'change' },
					{ required: true, message: '请输入课程名称', trigger: 'blur' }
				], // 课程名称
				time: [{
					type: 'array',
					required: true,
					fields: {
						0: { type: 'date', required: true, message: '请选择授课时间' },
						1: [{ type: 'date', required: true, message: '请选择授课时间' }
						],
					}
				}],
				sync_type: [{ type: 'number', required: true, message: '请选择是否同步课程表', trigger: 'change' }],
				lecture: [{ type: 'array', required: true, message: '请选择讲师', trigger: 'change' }],
				address: [{ required: true, message: '请输入授课地点', trigger: 'blur' }], // 授课地点
				course_depart_id: [{ validator: validateDepart, trigger: 'change' }],
				brief: [{ required: true, message: '请输入参训人员说明', trigger: 'blur' }],
				memo: [{ required: true, message: '请输入简介', trigger: 'blur' }]
			}
		};
	},
};