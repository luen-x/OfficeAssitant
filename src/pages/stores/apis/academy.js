const api = {
	/**
	 * common
	 */
	_ACADEMY_COMMON_TABLE_TITLE_GET: '/_train/train/table/info.json', // 表头获取
	_ACADEMY_COMMON_TABLE_TITLE_SAVE_POST: '/_train/train/table/save.json', // 表头保存
	_ACADEMY_COMMON_SELECT_STAFF_CONDITION_GET: '/_hr/train/train/select-staff-list-by-condition.json', // 按条件筛选人员
	_ACADEMY_COMMON_ALL_RANK_GET: '/_hr/human/rank/title-system-rank-select.json', // 按条件筛选人员

	/**
	 * 首页
	 */
	_ACADEMY_MAIN_SCHEDULE_GET: '/_train/train/schedule/schedule.json', // 首页课程表日历
	_ACADEMY_MAIN_SCHEDULE_COURSE_ADD_POST: '/_train/train/schedule/add.json', // 首页日历添加课程
	_ACADEMY_MAIN_SCHEDULE_COURSE_DELETE_GET: '/_train/train/schedule/del.json', // 首页日历删除课程
	_ACADEMY_MAIN_SCHEDULE_COURSE_EMPTY_GET: '/_train/train/schedule/clear.json', // 首页日历清空当日课程
	_ACADEMY_MAIN_SCHEDULE_COURSE_ENROLL_ADD_POST: '/_train/train/schedule/condition-add.json', // 首页日历报名
	ACADEMY_MAIN_ENROLL_LIST_GET: '/_train/train/schedule/apply-list.json', // 报名查看列表

	/**
	 * 新人输送
	 */
	ACADEMY_TRANSFER_TRANSFER_GET: '',
	// 新人输送列表
	ACADEMY_TRANSFER_TRANSFER_LIST_GET: '/_hr/train/train/list.json',
	// 获取所有的岗前培训课程
	_ACADEMY_TRANSFER_TRANSFER_ALL_COURSE_GET: '/_hr/train/train/get-all-course.json',
	// 有效员工
	_ACADEMY_TRANSFER_TRANSFER_STAFF_GET: '/_hr/human/staff/get-staff-by-search.json',
	// 新人输送 - 获取所有岗前培训课程
	_ACADEMY_TRANSFER_TRANSFER_COURSE_GET: '/_train/train/course-pre/get-course-list.json',
	// 淘汰原因
	_ACADEMY_TRANSFER_TRANSFER_PASS_REMARKS_GET: '/_hr/applicant/applicant/get-pass-remarks-types.json',
	// 根据课程id和按照授课时间查授课讲师
	_ACADEMY_TRANSFER_TRANSFER_TEACH_TIME_GET: '/_train/train/center-course/get-lecture-by-course-and-teach-time.json',

	// 安排培训或批量培训
	_ACADEMY_TRANSFER_TRANSFER_ARRANGE_TRAIN_POST: '/_hr/train/train/arrange-train.json',
	// 培训淘汰
	_ACADEMY_TRANSFER_TRANSFER_WEED_OUT_POST: '/_hr/train/train/weed-out.json',
	// 指派试岗部门
	_ACADEMY_TRANSFER_TRANSFER_TRY_DEPART_POST: '/_hr/applicant/applicant/design-try-depart.json',
	// 心态跟踪，批量心态跟踪
	_ACADEMY_TRANSFER_TRANSFER_MENTALITY_TRACKING_POST: '/_hr/train/train/mentality-tracking.json',
	// 恢复
	_ACADEMY_TRANSFER_TRANSFER_RECOVER_POST: '/_hr/train/train/recover.json',
	// 撤销
	_ACADEMY_TRANSFER_TRANSFER_BACK_OUT_POST: '/_hr/train/train/back-out.json',
	// 无需培训
	_ACADEMY_TRANSFER_TRANSFER_NO_NEED_TRAIN_POST: '/_hr/train/train/no-need-train.json',

	/**
	 * 新人输送-数据统计
	 */
	ACADEMY_TRANSFER_STATISTICS_GET: '',
	ACADEMY_TRANSFER_STATISTICS_LIST_GET: '/list',
	// 招聘来源试岗数据
	ACADEMY_TRANSFER_STATISTIC_TRY_RECRUIT_GET: '/_hr/train/try-statistics/try-data-applicant.json',
	// 组织部门试岗数据
	ACADEMY_TRANSFER_STATISTIC_TRY_ORGANIZATION_GET: '/_hr/train/try-statistics/try-data-depart.json',
	// 流失数据详情
	ACADEMY_TRANSFER_STATISTIC_LOSS_GET: '/_hr/train/lose-data/lose-by-try.json',
	// 讲师数据
	ACADEMY_TRANSFER_STATISTICS_TEACHERS_LIST_GET: '/_hr/train/lecture-statistics/lecture-course.json',
	// 需求统计
	ACADEMY_TRANSFER_STATISTICS_DEMAND_LIST_GET: '/_hr/train/need-position-statistics/index.json',
	// 试岗数据详情
	ACADEMY_TRANSFER_STATISTICS_TRY_DETAIL_LIST_GET: '/_hr/train/try-statistics/try-data-detail.json',
	// 讲师数据详情
	ACADEMY_TRANSFER_STATISTICS_TEACHER_LIST_GET: '/_hr/train/lecture-statistics/lecture-course-detail.json',
	// 需求统计
	ACADEMY_TRANSFER_STATISTIC_DEMAND_LIST_GET: '/_hr/train/need-position-statistics/index.json',

	ACADEMY_SUPPORT_TOOL_GET: '',
	ACADEMY_SUPPORT_TOOL_LIST_GET: '/list',
	ACADEMY_SUPPORT_STUDY_GET: '',
	ACADEMY_SUPPORT_STUDY_LIST_GET: '/list',
	ACADEMY_SUPPORT_COURSE_GET: '',
	/**
	 * 培训课程
	 */
	ACADEMY_SUPPORT_COURSE_LIST_GET: '/_train/train/course-pre/list.json', // 课程支持列表
	_ACADEMY_SUPPORT_COURSE_PRE_ADD_POST: '/_train/train/course-pre/save.json', // 岗前课程新建
	_ACADEMY_SUPPORT_COURSE_PRE_DETAIL_GET: '/_train/train/course-pre/detail.json', // 岗前课程详情
	_ACADEMY_SUPPORT_COURSE_PRE_DELETE_POST: '/_train/train/course-pre/delete.json', // 岗前课程删除
	_ACADEMY_SUPPORT_COURSE_DELETE_POST: '/_train/train/course/delete.json', // 三立培训课程删除
	_ACADEMY_SUPPORT_COURSE_SAVE_POST: '/_train/train/course/save.json', // 三立培训课程新建
	_ACADEMY_SUPPORT_COURSE_DETAIL_GET: '/_train/train/course/detail.json', // 三立培训课程详情
	_ACADEMY_SUPPORT_TRAIN_COURSE_SAVE_POST: '/_train/train/center-course/add.json', // 培训安排 三立培训/训练课程新建
	_ACADEMY_SUPPORT_TRAIN_COURSE_EDIT_POST: '/_train/train/center-course/edit.json', // 培训安排 三立培训/训练课程编辑
	_ACADEMY_SUPPORT_TRAIN_COURSE_DELETE_POST: '/_train/train/center-course/del.json', // 培训安排 三立培训/训练课程删除
	_ACADEMY_SUPPORT_TRAIN_COURSE_DETAIL_GET: '/_train/train/center-course/info.json', // 培训安排 三立培训/训练课程详情
	_ACADEMY_SUPPORT_COURSE_NAME_GET: '/_train/train/course/get-course-id-name.json', // 查询选择课程
	_ACADEMY_TRAIN_PLAN_DETAIL_EXPORT_GET: '/_train/train/center-course/export.json', // 签到结果导出
	_ACADEMY_TRAIN_PLAN_DETAIL_SIGN_QRCODE_GET: '/_train/train/sign/qr-code.json', // 签到二维码下载
	_ACADEMY_SUPPORT_COURSE_NAME_BY_TRAIN_GET: '/_train/train/center-course/get-course-name.json', // 按期数拿到课程名
	ACADEMY_TRAIN_PLAN_DETAIL_PARTICIPATE_LIST_GET: '/_train/train/participator/index.json', // 参与人员列表
	_ACADEMY_TRAIN_PLAN_DETAIL_PARTICIPATE_DELETE_POST: '/_train/train/participator/delete.json', // 删除参与人员
	_ACADEMY_TRAIN_PLAN_DETAIL_PARTICIPATE_ADD_POST: '/_train/train/participator/add.json', // 添加参与人员
	_ACADEMY_TRAIN_PLAN_DETAIL_SIGN_ADD_POST: '/_train/train/sign/send.json', // 发放签到
	_ACADEMY_TRAIN_PLAN_DETAIL_SIGN_DETAIL_GET: '/_train/train/sign/send-detail.json', // 发放签到详情
	_ACADEMY_TRAIN_PLAN_DETAIL_SIGN_RESULT_GET: '/_train/train/sign/result.json', // 发放签到结果统计
	_ACADEMY_TRAIN_PLAN_DETAIL_SIGN_RESULT_RECORD_GET: '/_train/train/sign/result-record.json', // 发放签到结果管理
	_ACADEMY_TRAIN_PLAN_DETAIL_SIGN_RESULT_EXPORT_GET: '/_train/train/sign/export.json', // 发放签到结果导出
	_ACADEMY_TRAIN_PLAN_DETAIL_SIGN_RESULT_RECORD_CHANGE_POST: '/_train/train/sign/result-record-change.json', // 发放签到结果出勤状态变更
	_ACADEMY_TRAIN_PLAN_DETAIL_EXAM_CHANGE_GET: '/_train/train/participator/change-exam-voucher.json', // 开启关闭考试上传
	_ACADEMY_TRAIN_PLAN_DETAIL_EXAM_NOTICE_POST: '/_train/train/participator/exam-remind.json', // 考试凭证提醒
	_ACADEMY_TRAIN_PLAN_DETAIL_EXAM_PASS_POST: '/_train/train/participator/pass.json', // 考试通关状态

	_ACADEMY_TRAIN_PLAN_DETAIL_EXAM_NOTICE_TIME_CHANGE_POST: '/_train/train/participator/set-exam-upload-time.json', // 考试凭证时间设置
	_ACADEMY_TRAIN_PLAN_DETAIL_PARTICIPATE_EXPORT_GET: '/_train/train/participator/export.json', // 参与人员导出
	/*
	*	统计中心 - 学员数据
	*/
	ACADEMY_STATISTICS_STUDENT_GET: '',
	ACADEMY_STATISTICS_STUDENT_LIST_GET: '/_train/sale/course-record/staff-study.json',
	// 学员详情 - 头部信息
	_ACADEMY_STATISTICS_STUDENT_STAFF_DETAIL_GET: '/_train/train/statistics/staff-detail.json',
	// 学员详情 - 岗前培训
	_ACADEMY_STATISTICS_STUDENT_PRE_TRAIN_GET: '/_train/train/statistics/pre-train.json',
	// 学员详情 - 三立培训、三立训练
	_ACADEMY_STATISTICS_STUDENT_THREE_TRAIN_GET: '/_train/train/statistics/three-train.json',

	/*
	*	统计中心 - 课程数据
	*/
	ACADEMY_STATISTICS_COURSE_GET: '',
	// 统计中心 - 课程数据
	ACADEMY_STATISTICS_COURSE_LIST_GET: '/_train/train/statistics/statistics-course.json',
	ACADEMY_STATISTICS_COURSE_NAME_GET: '',

	// 课程 - 恢复
	_ACADEMY_STATISTICS_COURSE_RECOVERY_LIST_POST: '/_train/train/center-course/recovery.json',
	// 课程 - 彻底删除
	_ACADEMY_STATISTICS_COURSE_DELETE_LIST_POST: '/_train/train/center-course/delete.json',

	// 课程数据 - 查看详情
	ACADEMY_STATISTICS_COURSE_NAME_LIST_GET: '/_train/train/statistics/course-detail.json',
	ACADEMY_STATISTICS_COURSE_TYPE_GET: '',
	ACADEMY_STATISTICS_COURSE_TYPE_LIST_GET: '/_train/train/statistics/course-detail.json',
	ACADEMY_STATISTICS_COURSE_TYPE_LIST_EXPORT: '/_train/sale/course-record/export.json',
	ACADEMY_TRAIN_SCHEDULE_GET: '',
	ACADEMY_TRAIN_PLAN_GET: '',
	ACADEMY_TRAIN_PLAN_LIST_GET: '/_train/train/center-course/list.json',
	_ACADEMY_TRAIN_CENTER_COURSE_STATISTIC_GET: '/_train/train/center-course/course-statistic.json',


	/*
	*	培训中心 - 通关上传
	*/
	ACADEMY_TRAIN_UPLOAD_GET: '',
	// 通关上传列表
	ACADEMY_TRAIN_UPLOAD_LIST_GET: '/_train/train/schedule/staff-list.json',

	// 添加通关案例
	_ACADEMY_TRAIN_UPLOAD_RECORD_POST: '/_train/train/schedule/record-add.json',
	// 话术通关保存
	_ACADEMY_TRAIN_UPLOAD_SCORE_POST: '/_train/train/schedule/score-add.json',
	// 撤销通关案例
	_ACADEMY_TRAIN_UPLOAD_SCORE_CANCEL_POST: '/_train/train/schedule/score-cancel.json',
	ACADEMY_TRAIN_PLAN_DETAIL_GET: '',
	ACADEMY_TRAIN_PLAN_DETAIL_PARTICIPATE_GET: '',
	ACADEMY_TRAIN_PLAN_DETAIL_SIGN_GET: '',
	ACADEMY_TRAIN_PLAN_DETAIL_EXAM_GET: '',
	ACADEMY_TRAIN_PLAN_DETAIL_EXAM_LIST_GET: '/_train/train/participator/exam-voucher-list.json',


	/*
	* 三立支持-工具包支持
	*/

	ACADEMY_SUPPORT_TOOL_MANAGE_LIST_GET: '/_cms/toolkit/kit-material/list.json',
	ACADEMY_SUPPORT_TOOL_SET_GET: '',
	ACADEMY_SUPPORT_TOOL_SET_LIST_GET: '/_cms/toolkit/kit-category/list.json', // 类目 - 列表
	_ACADEMY_SUPPORT_TOOL_CATEGORY_ALL_GET: '/_cms/toolkit/kit-category/all.json', // 类目 - 类目树
	_ACADEMY_SUPPORT_TOOL_CATEGORY_SAVE_POST: '/_cms/toolkit/kit-category/save.json', // 类目 - 新建/编辑
	_ACADEMY_SUPPORT_TOOL_CATEGORY_DELETE_GET: '/_cms/toolkit/kit-category/delete.json', // 类目 - 删除
	_ACADEMY_SUPPORT_TOOL_CATEGORY_DETAIL_GET: '/_cms/toolkit/kit-category/detail.json', // 类目 - 删除
	_ACADEMY_SUPPORT_TOOL_MATERIAL_SAVE_GET: '/_cms/toolkit/kit-material/save.json', // 素材 - 上传
	_ACADEMY_SUPPORT_TOOL_MATERIAL_EDIT_GET: '/_cms//toolkit/kit-material/edit.json', // 素材 - 编辑
	_ACADEMY_SUPPORT_TOOL_MATERIAL_DETAIL_GET: '/_cms/toolkit/kit-material/detail.json', // 素材 - 详情
	_ACADEMY_SUPPORT_TOOL_MATERIAL_DELETE_GET: '/_cms/toolkit/kit-material/delete.json', // 素材 - 详情
	_ACADEMY_SUPPORT_TOOL_ADJUST_POWER_POST: '/_cms/toolkit/kit-material/adjust-power.json', // 素材 - 权限调整
	_ACADEMY_SUPPORT_TOOL_MATERIAL_ADJUST_GET: '/_cms/toolkit/kit-material/adjust.json', // 类目调整
	_ACADEMY_SUPPORT_TOOL_FOLDER_PREVIEW_GET: '/_cms/toolkit/kit-folder/folder-preview.json', // 文件夹预览
	_ACADEMY_SUPPORT_TOOL_FOLDER_ALL_GET: '/_cms/toolkit/kit-folder/get-all-file.json', // 文件夹下所有文件
	/*
	* 三立支持-自习室
	*/
	_ACADEMY_SUPPORT_LIBRARY_CATEGORY_SAVE_GET: '/_cms/library/library-category/save.json', // 类目设置
	_ACADEMY_SUPPORT_LIBRARY_CATEGORY_ALL_GET: '/_cms/library/library-category/all.json', // 类目 - 类目树
	_ACADEMY_SUPPORT_LIBRARY_CATEGORY_DETAIL_GET: '/_cms/library/library-category/detail.json', // 类目 - 类目树
	_ACADEMY_SUPPORT_LIBRARY_CATEGORY_DELETE_GET: '/_cms/library/library-category/delete.json', // 类目 - 删除
	_ACADEMY_SUPPORT_LIBRARY_MATERIAL_DETAIL_GET: '/_cms/library/library-material/detail.json', // 素材-详情
	_ACADEMY_SUPPORT_LIBRARY_ADJUST_POWER_POST: '/_cms/library/library-material/adjust-power.json', //  素材 - 权限调整

	_ACADEMY_SUPPORT_LIBRARY_MATERIAL_EDIT_GET: '/_cms/library/library-material/edit.json', // 素材-编辑
	_ACADEMY_SUPPORT_LIBRARY_MATERIAL_SAVE_GET: '/_cms/library/library-material/save.json', // 素材-保存
	_ACADEMY_SUPPORT_LIBRARY_MATERIAL_DELETE_GET: '/_cms/library/library-material/delete.json', // 素材-删除
	_ACADEMY_SUPPORT_LIBRARY_MATERIAL_ADJUST_GET: '/_cms/library/library-material/adjust.json', // 素材-删除


	ACADEMY_SUPPORT_TOOL_DOWNLOAD_GET: '',
	ACADEMY_SUPPORT_TOOL_DOWNLOAD_LIST_GET: '/list',
	ACADEMY_SUPPORT_STUDY_MANAGE_GET: '',
	ACADEMY_SUPPORT_STUDY_MANAGE_LIST_GET: '/_cms/library/library-material/list.json',
	ACADEMY_SUPPORT_STUDY_SET_GET: '',
	ACADEMY_SUPPORT_STUDY_SET_LIST_GET: '/_cms/library/library-category/list.json',
	ACADEMY_SUPPORT_STATISTICS_MANAGE_GET: '',
	ACADEMY_SUPPORT_STATISTICS_MANAGE_LIST_GET: '/_cms/download/material-download/statistics.json',
	ACADEMY_SUPPORT_STATISTICS_WARNING_GET: '',
	ACADEMY_SUPPORT_STATISTICS_WARNING_LIST_GET: '/_cms/download/warning-rule/list.json',
	ACADEMY_SUPPORT_STATISTICS_MANAGE_DETAIL_GET: '',
	ACADEMY_SUPPORT_STATISTICS_MANAGE_DETAIL_LIST_GET: '/_cms/download/material-download/list.json',
	ACADEMY_SUPPORT_STUDY_DOWNLOAD_GET: '',
	ACADEMY_SUPPORT_STUDY_DOWNLOAD_LIST_GET: '/list',
	ACADEMY_STATISTICS_TREND_GET: '',

	// 客户案例
	ACADEMY_SUPPORT_CASE_GET: '',
	ACADEMY_SUPPORT_CASE_LIST_GET: '/_cms/material/case-material/list.json',
	_ACADEMY_SUPPORT_CASE_ADD_POST: '/_cms/material/case-material/save.json',
	_ACADEMY_SUPPORT_CASE_DELETE_POST: "/_cms/material/case-material/delete.json",
	_ACADEMY_SUPPORT_CASE_DETAIL_GET: '/_cms/material/case-material/detail.json',
	_ACADEMY_SUPPORT_CASE_PRODUCT_TYPE_GET: '/_cms/material/case-material/get-product-type.json',
	_ACADEMY_SUPPORT_CASE_PRODUCT_TYPE_SAVE_POST: '/_cms/material/case-material/product-type-save.json',
	_ACADEMY_SUPPORT_CASE_PRODUCT_TYPE_DELETE_POST: '/_cms/material/case-material/product-type-delete.json',

	

};

export default api;
