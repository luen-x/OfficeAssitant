const api = {
	/**
	 * 请注释模块内容
	 */

	/**
	 * 商学院-退款申请
	 */
	COLLAGE_CUSTOMER_REFUND_GET: '',
	COLLAGE_CUSTOMER_REFUND_LIST_GET: '/_sale/sale/refund/list.json',
	
	_COLLAGE_CUSTOMER_REFUND_AUDIT_POST: "/_business/business/refund/audit.json", // 退款审核

	/**
	 * 商学院-首页
	 */
	COLLAGE_MAIN_GET: '/_business/business/index/remind.json',
	_COLLAGE_MAIN_CUSTUMER_SERVICE_GET: '/_business/business/index/record-remind.json', // 商学院首页客户服务
	_COLLAGE_MAIN_CONTRACT_LIST_GET: '/_business/business/index/contract-remind.json', // 商学院首页合同动态
	_COLLAGE_MAIN_AUDIT_LIST_GET: '/_business/business/index/audit-info.json', // 商学院首页审核信息
	_COLLAGE_MAIN_SCHEDULE_ONLINE_GET: '/_business/lesson/schedule/lesson-online.json', // 商学院首页线上课程表
	_COLLAGE_MAIN_SCHEDULE_OFFLINE_GET: '/_business//lesson/schedule/lesson-offline.json', // 商学院首页线下课程表
	_COLLAGE_MAIN_SCHEDULE_ONLINE_DAY_GET: '/_business/lesson/schedule/lesson-online-info.json', // 每日线上数据
	_COLLAGE_MAIN_SCHEDULE_OFFLINE_DAY_GET: '/_business/lesson/schedule/lesson-offline-info.json', // 每日线下数据
	_COLLAGE_MAIN_SCHEDULE_ONLINE_SAVE_POST: '/_business/lesson/schedule/save-lesson-online.json', // 添加线上课程
	_COLLAGE_MAIN_SCHEDULE_OFFLINE_SAVE_POST: '/_business//lesson/schedule/save-lesson-offline.json', // 添加线下课程
	_COLLAGE_MAIN_SCHEDULE_ONLINE_INFO_GET: '/_business/lesson/schedule/lesson-online-detail.json', // 线上课程详情
	_COLLAGE_MAIN_SCHEDULE_OFFLINE_INFO_GET: '/_business/lesson/schedule/lesson-offline-detail.json', // 线下课程详情
	_COLLAGE_MAIN_SCHEDULE_ONLINE_DELETE_GET: '/_business/lesson/schedule/delete-lesson-online.json', // 删除线上课程
	_COLLAGE_MAIN_SCHEDULE_OFFLINE_DELETE_GET: '/_business/lesson/schedule/delete-lesson-offline.json', // 删除线下课程
	_COLLAGE_MAIN_SCHEDULE_TEACHER_GET: '/_business//lesson/schedule/get-depart-lecturer.json', // 获取部门讲师
	_COLLAGE_MAIN_SCHEDULE_DEPARTS_GET: '/_business/lesson/schedule/get-business-depart.json', // 获取线上线下部门
	_COLLAGE_MAIN_SCHEDULE_COMPANY_GET: '/_business/lesson/schedule/get-contract-company.json', // 获取合同公司
	_COLLAGE_MAIN_SCHEDULE_SERIES_GET: '/_business/lesson/schedule/get-lecturer-set.json', // 获取公司下套系
	_COLLAGE_MAIN_SCHEDULE_LECTURER_GET: '/_business/lesson/schedule/get-lecturer.json', // 获取套系下讲师
	_COLLAGE_MAIN_SCHEDULE_LECTURER_TABLE_GET: '/_business/lesson/schedule/get-lecturer-leisure.json', // 获取看看谁有空表格数据
	_COLLAGE_MAIN_SCHEDULE_OFFLINE_LECTURER_GET: '/_business/lesson/schedule/get-lecturer-leisure.json', // 线下课程-讲师列表

	/**
	 * 商学院-常规设置
	 */
	COLLAGE_SETTING_COURSE_LIST_GET: '/_business/business/set/lecture-set-list.json', // 课程列表
	_COLLAGE_SETTING_COURSE_RECORD_FIELD_LIST_GET: '/_business/business/data/record-field-list.json', // 大课培训录单字段
	_COLLAGE_SETTING_COURSE_SAVE_POST: '/_business/business/set/add-lecture-set.json', // 课程、套系添加
	_COLLAGE_SETTING_COURSE_EDIT_POST: '/_business/business/set/edit-lecture-set.json', // 课程、套系编辑
	_COLLAGE_SETTING_COURSE_DELETE_POST: '/_business/business/set/delete-lecture-set.json', // 课程、套系删除
	_COLLAGE_SETTING_COURSE_INFO_GET: '/_business/business/set/lecture-set-info.json', // 课程、套系详情
	_COLLAGE_SETTING_COURSE_PRODUCT_LIST_GET: '/_business/business/data/get-product-by-category.json', // 产品列表
	_COLLAGE_SETTING_SUBSIDY_ALLOWANCE_LIST_GET: '/_business/business/set/allowance-list.json', // 补贴列表
	_COLLAGE_SETTING_SUBSIDY_EDIT_POST: '/_business/business/set/set-allowance.json', // 补贴编辑
	_COLLAGE_SETTING_SUBSIDY_INFO_GET: '/_business/business/set/allowance-info.json', // 补贴详情
	_COLLAGE_SETTING_SUBSIDY_COURSE_LIST_GET: '/_business/business/data/lecture-set-list.json', // 课程列表
	COLLAGE_SETTING_PROMOTING_LIST_GET: '/_hr/human/salary/rate-list.json', // 提成设置列表
	COLLAGE_SETTING_TEAM_LIST_GET: '/_hr/human/salary/rate-list.json', // 团队提成设置列表
	/**
	 * 商学院-质检管理
	 */
	COLLAGE_CHECK_SERVICE_LIST_GET: "/_business/business/quality/list.json", // 质检列表
	_COLLAGE_CHECK_SERVICE_PRODUCT_LIST_GET: '/_business/business/data/product-list.json', // 历史下单产品列表
	_COLLAGE_CHECK_SERVICE_LESSON_LIST_GET: '/_business/business/data/lesson-name-list.json', // 历史所有套系列表
	_COLLAGE_CHECK_SERVICE_ALLOCATE_LIST_GET: '/_business/business/quality/assign-list.json', // 分配列表
	_COLLAGE_CHECK_SERVICE_ALLOCATE_POST: '/_business/business/quality/operate.json', // 分配
	_COLLAGE_CHECK_SERVICE_CHECK_RECORDS_LIST_GET: '/_business/business/quality-record/list.json', // 质检记录列表
	_COLLAGE_CHECK_SERVICE_LESSON_RECORD_LIST_GET: '/_business/business/data/lesson-record-list.json', // 套系分配信息列表
	_COLLAGE_CHECK_SERVICE_CHECK_RECORDS_POST: '/_business/business/quality-record/add.json', // 添加质检记录
	_COLLAGE_CHECK_SERVICE_CHECK_RECORDS_EDIT_POST: '/_business/business/quality-record/edit.json', // 编辑质检记录
	_COLLAGE_CHECK_SERVICE_RECORDS_INFO_GET: '/_business/business/quality-record/info.json', // 质检套系评分统计
	_COLLAGE_CHECK_SERVICE_RECORDS_ADD_INFO_GET: '/_business/business/quality-record/lesson-appeal.json', // 质检添加详情
	_COLLAGE_CHECK_SERVICE_COURSE_RECORD_LIST_GET: '/_business/business/quality-record/lesson-record-list.json', // 质检课程记录
	_COLLAGE_CHECK_SERVICE_APPEAL_LIST_GET: '/_business/business/quality-record/quality-appeal-list.json', // 质检申诉记录列表
	_COLLAGE_CHECK_SERVICE_LESSON_SCORE_STATIC_GET: '/_business/business/quality-record/lesson-score-static.json', // 质检套系评分统计
	_COLLAGE_CHECK_SERVICE_QUALITY_STATIC_GET: '/_business/business/quality-record/quality-num-static.json', // 质检套系数量统计
	_COLLAGE_CHECK_SERVICE_QUALITY_TYPE_GET: '/_business/business/quality-record/quality-type-static.json', // 质检方式统计
	_COLLAGE_CHECK_SERVICE_APPEAL_LESSON_GET: '/_business/business/data/appeal-lesson-list.json', // 申诉质检套系列表

	COLLAGE_CHECK_STATISTIC_CHECK_LIST_GET: '/_business/business/quality-record/staff-quality-list.json', // 员工/客户质检数据
	COLLAGE_CHECK_STATISTIC_QUALITY_LIST_GET: '/_business/business/quality-record/staff-quality-record-list.json', // 讲师质检记录数据
	_COLLAGE_CHECK_STATISTIC_QUALITY_COMPANY_INFO_LIST_GET: '/_business/business/quality/company-info.json', // 公司基本信息
	_COLLAGE_CHECK_SERVICE_EXPORT_GET: '/_business/business/quality/export.json', // 质检导出请求
	COLLAGE_CHECK_SERVICE_EXPORT_LIST_GET: '/_business/business/quality/excel-list.json', // 质检导出列表
	/**
	 * 商学院-表头
	 */
	_COLLAGE_BUSINESS_TABLE_INFO_GET: "/_business/business/table/info.json", // 表头 - 获取
	_COLLAGE_BUSINESS_TABLE_SAVE_POST: "/_business/business/table/save.json", // 表头 - 保存

	/**
	 * 商学院-客户合同
	 */
	COLLAGE_CUSTOMER_COOPERATE_LIST_GET: "/_business/business/project/project-list.json", // 客户合同 - 列表
	_COLLAGE_CUSTOMER_COOPERATE_DEPART_GET: "/_business/business/project/depart-list.json", // 客户合同 - 获取分配
	_COLLAGE_CUSTOMER_COOPERATE_DELIVERY_GET: "/_business/business/project/delivery.json", // 客户合同/客户服务 - 交付表
	_COLLAGE_CUSTOMER_COOPERATE_ORDER_INFO_GET: "/_business/business/project/order-info.json", // 获取下单信息

	_COLLAGE_CUSTOMER_COOPERATE_ASSIGN_POST: "/_business/business/project/assign.json", // 客户合同 - 分配
	_COLLAGE_CUSTOMER_COOPERATE_DELIVERY_UPLOAD_POST: "/_business/business/project/delivery-upload.json", // 客户合同/客户服务 - 上传交付表
	_COLLAGE_CUSTOMER_COOPERATE_TOP_ADD_POST: "/_business/business/project/top-add.json", // 添加置顶
	_COLLAGE_CUSTOMER_COOPERATE_TOP_DEL_POST: "/_business/business/project/top-del.json", // 删除置顶
	_COLLAGE_CUSTOMER_COOPERATE_ORDER_EDIT_POST: "/_business/business/project/order-edit.json", // 保存下单信息
	_COLLAGE_CUSTOMER_COOPERATE_AUDIT_POST: "/_business/business/project/audit.json", // 项目审核
	_COLLAGE_CUSTOMER_COOPERATE_CHANGE_COST_POST: "/_business/business/project/change-cost.json", // 修改成本

	/**
	 * 商学院-客户服务
	 */
	COLLAGE_SERVICE_LIST_GET: "/_business/business/project/project-lesson-list.json", // 客户服务 - 列表
	_COLLAGE_SERVICE_APPEAL_LESSON_LIST_GET: "/_business/business/data/appeal-lesson-list.json", // 申诉质检套系列表
	_COLLAGE_SERVICE_APPEAL_COMPANY_GET: "/_business/business/data/get-company-items.json", // 公司列表

	_COLLAGE_SERVICE_APPEAL__POST: "/_business/business/quality-record/appeal.json", // 质检申诉

	/**
	 * 商学院-服务分配
	 */
	_COLLAGE_BUSINESS_ASSIGN_INFO_GET: "/_business/business/lesson/assign-info.json", // 客户服务 - 服务分配
	_COLLAGE_BUSINESS_STAFF_LIST_GET: "/_business/business/lesson/staff-list.json", // 客户服务 - 分配人员列表
	_COLLAGE_BUSINESS_ASSIGN_RECORD_GET: "/_business/business/lesson/assign-record.json", // 客户服务 - 分配记录
	_COLLAGE_BUSINESS_LECTURE_SET_LIST_GET: "/_business/business/data/lecture-set-list.json", // 课程列表
	_COLLAGE_BUSINESS_PRODUCT_GET: "/_cms/product/product/get-product-by-category.json", // 产品 - 获取线上线下产品
	_COLLAGE_BUSINESS_DEPART_LIST_GET: "/_business/business/project/depart-list.json", // 客户合同 - 获取分配、转让部门
	_COLLAGE_BUSINESS_STAFF_ORDER_DETAIL_GET: "/_business/business/lesson/staff-order-detail.json", // 客户服务 - 分配人员悬浮窗详情

	_COLLAGE_BUSINESS_ASSIGN_MAIN_STAFF_POST: "/_business/business/lesson/assign-main-staff.json", // 客户服务 - 分配、修改流程对接人
	_COLLAGE_BUSINESS_ADD_LESSON_POST: "/_business/business/lesson/add-lesson.json", // 客户服务 - 添加套系、场次
	_COLLAGE_BUSINESS_CHANGE_LESSON_POST: "/_business/business/lesson/change-lesson.json", // 客户服务 - 变更套系
	_COLLAGE_BUSINESS_DEL_LESSON_POST: "/_business/business/lesson/del-lesson.json", // 客户服务 - 删除分配
	_COLLAGE_BUSINESS_LESSON_ASSIGN_POST: "/_business/business/lesson/assign.json", // 客户服务 - 分配、修改
	_COLLAGE_BUSINESS_LESSON_EDIT_PRODUCT_POST: "/_business/business/lesson/edit-product.json", // 客户服务 - 修改合作项目
	_COLLAGE_BUSINESS_PROJECT_ASSIGN_POST: "/_business/business/project/assign.json", // 客户合同 - 分配、转让

	/**
	 * 服务记录
	 */
	_COLLAGE_BUSINESS_RECORD_INFO_GET: "/_business/business/record/record-info.json", // 服务记录

	_COLLAGE_BUSINESS_RECORD_ADD_POST: "/_business/business/record/record-add.json", // 服务记录 - 添加
	_COLLAGE_BUSINESS_RECORD_AUDIT_POST: "/_business/business/record/audit.json", // 服务记录 - 审核
	_COLLAGE_BUSINESS_RECORD_AUDIT_ALL_POST: "/_business/business/record/audit-all.json", // 服务记录 - 全部通过
	_COLLAGE_BUSINESS_RECORD_COMPLETE_POST: "/_business/business/record/complete.json", // 服务记录 - 结束课程
	_COLLAGE_BUSINESS_RECORD_COMPLETE_CANCEL_POST: "/_business/business/record/complete-cancel.json", // 服务记录 - 撤回结束课程

	/**  
	 * 商学院 -  线上/线下课程录单列表
	*/
	COLLAGE_RECORD_ONLINE_LIST_GET: '/_business/lesson/record-list/lesson-list.json', // 线上/线下课程录单列表
	COLLAGE_RECORD_OUTLINE_LIST_GET: '/_business/lesson/record-list/lesson-list.json', // 线上/线下课程录单列表
	_COLLEAGE_RECORD_LESSON_DETAIL_GET: '/_business/lesson/record-list/lesson-info.json', // 线上/线下课程详情
	_COLLEAGE_RECORD_LESSON_SUBJECT_GET: '/_business/lesson/record-list/get-lesson-subject.json', // 获取课程主题
	_COLLEAGE_RECORD_LESSON_FIELD_GET: '/_business/lesson/record-list/get-open-lesson-field.json', // 获取大课培训字段
	_COLLEAGE_RECORD_LESSON_DETAIL_EDIT_GET: '/_business/lesson/record-list/get-open-lesson-detail.json', // 获取大课录单详情
	_COLLEAGE_RECORD_LESSON_SAVE_LESSON_POST: '/_business/lesson/record-list/save-open-lesson.json', // 保存大课录单字段
	COLLAGE_RECORD_LESSON_LIST_GET: '/_business/lesson/record-list/open-lesson-list.json', // 大课录单列表
	_COLLEAGE_RECORD_LESSON_CANCEL_POST: '/_business/lesson/record-list/cancel.json', // 大课录单撤销
	_COLLEAGE_RECORD_LESSON_RECORD_ADD: '/_business/business/record/record-add.json', // 服务记录 - 添加
	_COLLEAGE_RECORD_LESSON_RECORD_AUDIT_POST: '/_business/business/record/audit.json', // 服务记录 - 审核
	_COLLEAGE_RECORD_LESSOM_AUDIT_ALL_POST: '/_business/business/record/audit-all.json', // 服务记录 - 全部通过
	_COLLEAGE_RECORD_LESSON_COMPLETE_POST: '/_business/business/record/complete.json', // 服务记录 - 结束课程
	_COLLEAGE_RECORD_LESSON_COMPLETE_CANCEL_POST: '/_business/business/record/complete-cancel.json', // 服务记录 - 撤回结束课程
	_COLLEAGE_RECORD_LESSON_LECTURE_LIST: '/_business/business/data/lecture-set-list.json', // 课程列表
	_COLLEAGE_RECORD_LESSON_LESSON_ROLE_GET: '/_business/lesson/record-list/get-open-lesson-role.json', // 获取大课角色
	_COLLEAGE_RECORD_ACTIVITY_LOOK_GET: '/_cms/activity/activity-category/activity-look.json',
	_COLLEAGE_RECORD_LESSON_AUDIT_ALL_POST: '/_business/business/record/audit-all.json', // 服务记录 - 全部通过
	/**  
	 * 商学院 - 薪资统计
	*/
	COLLAGE_SALARY_LIST_GET: '/_finance/finance/commission/salary-list.json', // 薪资列表,
	COLLAGE_CONSULTATION_GET: ''
};
export default api;
