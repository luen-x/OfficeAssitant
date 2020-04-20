const api = {
	/**
	 * common
	 */
	// 公司下的一级部门
	HR_STAIR_DEPART_GET: '/_hr/human/depart/son.json',
	// 公司下的所有部门
	_HR_DEPART_ALL_GET: '/_hr/human/depart/all.json',
	// 公司下的营销部门全的，别的部门到二级部门
	_HR_DEPART_PART_GET: '/_hr/applicant/need-position/departs.json',
	// 部门下的职位列表
	_HR_DEPART_POSITION_GET: '/_hr/human/position/select-depart-position.json',
	// 角色列表
	_HR_ROLE_DATA_GET: '/_auth/api/role/list.json',
	// 角色下对应的员工
	_HR_ROLE_STAFF_LIST_GET: '/_auth/auth/role/staff-list.json',
	// 公司下的所有部门
	_HR_ALL_DEPART_GET: '/_hr/human/depart/all.json',
	// 部门下的所有职位 (要删除，请使用  _HR_DEPART_POSITION_GET)
	_HR_DEPART_JOB_GET: '/_hr/human/position/select-depart-position.json',
	// 根据员工姓名或手机号搜索员工 新增转岗、离职专用
	_HR_NAME_OR_PHONE_STAFF_GET: '/_hr/human/transfer/staff-info.json',
	// 根据姓名，手机号搜索员工
	_HR_MUTI_TERM_STAFF_GET: '/_hr/human/staff/get-staff-by-search.json',
	// 根据姓名，手机号搜索员工/展示部门
	_HR_MUTI_TERM_STAFF_DEPART_GET: '/_hr/human/staff/get-staff-info-by-search.json',
	// 根据姓名，手机号搜索补贴人（交通补贴专用）
	_HR_SUBSIDY_MEMBER_GET: '/_hr/human/subsidy/get-staff-by-search.json',
	// 根据姓名，手机号，工号搜索员工转介绍人专用
	_HR_MUTI_TERM_STAFF_NEW_GET: '/_hr/human/staff/get-staff-by-search-new.json',
	// 根据部门id查找当前部门到一级部门数组
	_HR_DEPART_ARRAY_BY_DEPART_GET: '/_hr/api/human/get-depart-ids-by-depart-id.json',
	// 根据政委id获取所管理战区信息
	_HR_WAR_BY_STAFF_GET: '/_hr/human/depart/get-two-level-depart-by-staff-id.json',
	// 业务跟踪-员工数据部门筛选框
	_HR_BUSINESS_DEPART_BY_STAFF_ID_GET: '/_hr/human/depart/get-depart-select-by-staff-id.json',


	// 血型
	_HR_STAFF_BLOOD_GET: '/_hr/human/staff/get-blood.json',
	// 星座
	_HR_STAFF_CONSTELLATION_GET: '/_hr/human/staff/get-constellation.json',
	// 民族
	_HR_STAFF_NATIONS_GET: '/_hr/human/other/get-nations.json',
	// 学历
	_HR_STAFF_EDUCATION_GET: '/_hr/human/staff/get-education.json',
	// 计算机能力和外语能力下拉选择
	_HR_STAFF_SKILL_LEVEL_GET: '/_hr/human/staff/get-level.json',
	// 对前台的印象下拉选择
	_HR_STAFF_IMPRESSION_GET: '/_hr/human/staff/get-impression.json',
	// 角色
	_AUTH_ROLE_LIST_GET: '/_auth/auth/role/list.json',
	// 户口性质下拉选择
	_HR_STAFF_RESIDENCE_GET: '/_hr/human/staff-information/get-residence.json',
	// 招聘渠道拉选择
	_HR_STAFF_DITCHES_GET: '/_hr/applicant/applicant/get-ditches.json',
	// 邀约人
	_HR_STAFF_GET: '/_hr/api/human/find-staff.json',
	// 转介绍人
	_HR_INTRODUCER_GET: '/_hr/api/human/find-introduce-staff.json',
	// 试用期
	_HR_STAFF_PROBATION_SELECT_GET: '/_hr/human/staff/probation-select.json',
	// 底薪设置
	_HR_STAFF_BASE_SALARY_GET: '/_hr/human/staff-information/get-basic-salary-name-list.json',
	// 提成设置
	_HR_STAFF_RATE_CASE_GET: '/_hr/human/staff-information/get-rate-case-name-list.json',
	// 社保缴纳公司
	_HR_STAFF_SOCIAL_CONTRACT_COMPANY_GET: '/_hr/human/staff-information/social-contract-company.json',
	// 合同公司
	_HR_STAFF_CONTRACT_COMPANY_GET: '/_hr/human/staff-information/contract-company.json',
	// 模板搜索
	_HR_MODULE_GET: '/_hr/human/document/offer-list.json',
	// 根据登录人查询所有有效员工列表
	_HR_DEPART_STAFF: '/_hr/api/depart/get-depart-select-with-staff-info.json',
	// 淘汰、离开类型
	_HR_PASS_REMARKS_TYPE_GET: '/_hr/applicant/applicant/get-pass-remarks-types.json',
	// 淘汰类型
	_HR_PASS_TYPES_GET: '/_hr/applicant/applicant/get-pass-remarks-types.json',
	// 离职主因
	_HR_LEAVE_REASON_GET: '/_hr/human/template/leave-reason.json',
	// 离职类型
	_HR_LEAVE_TYPE_GET: '/_hr/human/template/leave-type.json',
	// 新增转岗底薪、提成制度
	_HR_EMPLOYEE_RELATION_TRAN_BASIC_RATE_GET: '/_hr/human/transfer/staff-salary.json',
	// 获取营销部门所有职位
	_HR_SALE_POSITION_GET: '/_hr/human/position/get-sale-position.json',

	/**
	 * 首页
	 */
	// 人事首页
	HR_MAIN_GET: '/_hr/human/index/all-index.json',
	_HR_MAIN_ADD_SCHEDULE_POST: '/_hr/human/index/add-schedule.json',
	_HR_MAIN_ADD_SCHEDULE_GET: '/_hr/human/index/detail-schedule.json',
	_HR_MAIN_DONE_SCHEDULE_POST: '/_hr/human/index/finish-schedule.json',
	_HR_MAIN_DEL_SCHEDULE_POST: '/_hr/human/index/del-schedule.json',
	HR_MAIN_SCHEDULE_GET: '/_hr/human/index/month-schedule.json',

	/**
	 * 招聘管理
	 */
	_HR_RECRUIT_STATUS_CHANGE_GET: '/_hr/applicant/recognition/recognition-status.json',
	_HR_RECRUIT_ADD_REMARKS_POST: '/_hr/applicant/school/say.json',
	// 校招总表
	HR_RECRUIT_SCHOOL_SUMMARY_LIST_GET: '/_hr/applicant/school/student-index.json',
	// 校招总表表头顺序获取
	_HR_RECRUIT_CONFIG_GET: '/_hr/human/label-setting/get-edit-info.json',
	// 校招总表表头顺序保存
	_HR_RECRUIT_CONFIG_SAVE_POST: '/_hr/human/label-setting/save-settings.json',
	// 录入学生信息
	_HR_RECRUIT_SCHOOL_SUMMARY_ADD_INFO_POST: '/_hr/applicant/school/add-info.json',
	// 查看学生信息
	_HR_RECRUIT_SCHOOL_SUMMARY_GET_INFO_GET: '/_hr/applicant/school/student-detail.json',
	// 根据学校名称搜索招聘会信息
	_HR_RECRUIT_SCHOOL_SUMMARY_SEARCH_MEETING_POST: '/_hr/applicant/meeting/get-meeting-info.json',
	_HR_RECRUIT_SCHOOL_SUMMARY_EXPORT_PAPER_POST: '/_hr/applicant/meeting/export-paper.json',
	// 管理层是否可见备注
	_HR_RECRUIT_SCHOOL_SUMMARY_IS_MANAGER_REMARK_POST: '/_hr/applicant/school/is-show-manager-remark.json',
	// 添加备注
	_HR_RECRUIT_SCHOOL_SUMMARY_ADD_MSG_POST: '/_hr/applicant/school/say.json',
	// 招聘会年份
	_HR_RECRUIT_SCHOOL_JOBFAIR_YEAR_GET: '/_hr/applicant/school/get-meeting-years.json',
	// 招聘会季节
	_HR_RECRUIT_SCHOOL_SEASON_TYPE_GET: '/_hr/applicant/school/get-season-types.json',
	// 招聘学校列表
	HR_RECRUIT_SCHOOL_JOBFAIR_SCHOOL_LIST_GET: '/_hr/applicant/meeting/meeting-school-list.json',
	// 招聘学校添加
	_HR_RECRUIT_SCHOOL_JOBFAIR_SCHOOL_ADD_POST: '/_hr/applicant/meeting/add-meeting-school.json',
	// 招聘学校详情
	_HR_RECRUIT_SCHOOL_JOBFAIR_SCHOOL_DETAIL_GET: '/_hr/applicant/meeting/add-meeting-school.json',
	// 删除应聘者
	HR_RECRUIT_SCHOOL_DEL_POST: '/_hr/applicant/school/delete-applicant.json',
	// 变更状态
	HR_RECRUIT_SCHOOL_CHANGE_POST: '/_hr/applicant/school/change-status.json',
	// 恢复操作
	HR_RECRUIT_SCHOOL_SUMMARY_RECOVER_POST: '/_hr/applicant/school/recover.json',
	// 淘汰应聘者
	HR_RECRUIT_SCHOOL_PASS_POST: '/_hr/applicant/school/pass-student.json',
	// 指派试岗部门
	HR_RECRUIT_SCHOOL_SUMMARY_ASSIGN_POST: '/_hr/applicant/applicant/design-try-depart.json',
	// 上传附件
	_HR_RECRUIT_SCHOOL_UPLOAD_POST: '/_hr/applicant/applicant/upload.json',
	// 删除备注
	HR_RECRUIT_SCHOOL_REMARK_DEL_POST: '/_hr/applicant/school/delete-remark.json',
	// 获取应聘者邮箱号
	_HR_RECRUIT_EMAIL_GET: "/_public/email/email/show.json",
	// 发邮件
	_HR_RECRUIT_SEND_EMAIL_POST: "/_public/email/email/send.json",
	// 删除邮件
	_HR_RECRUIT_DEL_EMAIL_GET: "/_public/email/email/del.json",
	// 邮件详情
	_HR_RECRUIT_EMAIL_DETAIL_GET: "/_public/email/email/detail.json",
	// 邮件列表
	HR_RECRUIT_SCHOOL_SUMMARY_ELISTS_LIST_GET: '/_public/email/email/list.json',
	// 邮件添加带入富文本附件
	_HR_RECRUIT_SCHOOL_SUMMARY_EMAIL_EDITOR_GET: '/_hr/human/document/offer-conf-detail.json',
	// 校招批量编辑
	_HR_RECRUIT_SCHOOL_BATCH_POST: '/_hr/applicant/school/batch-edit.json',
	_HR_RECRUIT_SCHOOL_SAVE_LABEL_SETTINGS_POST: "/_hr/human/search-label/set-labels.json", // 保存表头
	_HR_RECRUIT_SCHOOL_EDIT_CUSTOMER_LABEL_SETTING_GET: "/_hr/human/search-label/get-labels.json", // 获取表头数据
	// 社招批量编辑
	_HR_RECRUIT_SOCIAL_BATCH_POST: '/_hr/applicant/applicant/batch-edit.json',
	// 校招简历列表
	HR_RECRUIT_SCHOOL_IDENTIFY_LIST_GET: '/_hr/applicant/recognition/index.json',
	// 识别简历
	_HR_RECRUIT_IDENTIFY_RESUME_POST: '/_hr/applicant/recognition/recognition-resume.json',
	// 识别简历单条编辑
	_HR_RECRUIT_IDENTIFY_RESUME_EDIT_POST: '/_hr/applicant/recognition/edit.json',
	// 招聘会
	HR_RECRUIT_SCHOOL_JOBFAIR_GET: '',
	HR_RECRUIT_SCHOOL_JOBFAIR_LIST_GET: '/_hr/applicant/meeting/meeting-index.json',
	_HR_RECRUIT_SCHOOL_JOBFAIR_TEL_PROGRESS_POST: '/_hr/applicant/meeting/communication.json', // 校招—招聘会—填写沟通进度
	_HR_RECRUIT_SCHOOL_UNIFY_INTERVIEW_POST: '/_hr/applicant/school/unify-interview.json', // 校招—统一面试
	_HR_RECRUIT_SCHOOL_BATCH_CHANGE_POST: '/_hr/applicant/school/batch-change.json', // 校招—批量变更应聘者
	_HR_RECRUIT_SCHOOL_ANSWER_RESULT_GET: "/_hr/applicant/paper/answer-result-detail.json",
	_HR_RECRUIT_SCHOOL_PAPER_QUESTION_PRE_GET: '/_hr/applicant/paper/answer-question-detail.json', // 试题预览

	// 校招
	HR_RECRUIT_SCHOOL_STATISTICS_GET: '',
	HR_RECRUIT_SCHOOL_STATISTICS_LIST_GET: '/_hr/applicant/school-statistics/school-data.json', // 招聘会统计
	HR_RECRUIT_SCHOOL_STATISTICS_DATA_LIST_GET: '/_hr/applicant/school-statistics/try-data.json', // 试岗统计
	HR_RECRUIT_SCHOOL_STATISTICS_POSITION_LIST_GET: '/_hr/applicant/school-statistics/position-data.json', // 职位统计
	HR_RECRUIT_SCHOOL_STATISTICS_INFO_GET: '',
	HR_RECRUIT_SCHOOL_STATISTICS_INFO_LIST_GET: '/_hr/applicant/school-statistics/look-school-data.json',
	// 校招招聘会
	HR_RECRUIT_SCHOOL_JOBFAIR_INFO_GET: '',
	HR_RECRUIT_SCHOOL_JOBFAIR_ADD_GET: '',
	HR_RECRUIT_SCHOOL_JOBFAIR_EDIT_GET: '',
	_HR_RECRUIT_SCHOOL_JOBFAIR_SCHOOL_NAME_GET: '/_hr/applicant/meeting/check-meeting-school.json', // 判断学校名是否已存在
	_HR_RECRUIT_SCHOOL_JOBFAIR_INFO_GET: '/_hr/applicant/meeting/meeting-detail.json',
	_HR_RECRUIT_SCHOOL_JOBFAIR_ADD_POST: '/_hr/applicant/meeting/add-meeting.json',
	_HR_RECRUIT_SCHOOL_JOBFAIR_ADD_REMARKS_POST: '/_hr/applicant/meeting/say.json',
	_HR_RECRUIT_SCHOOL_JOBFAIR_STATUS_POST: '/_hr/applicant/meeting/change-meeting.json',
	_HR_RECRUIT_SCHOOL_JOBFAIR_DELETE_POST: '/_hr/applicant/meeting/delete-meeting.json',
	// 校招试岗分配
	HR_RECRUIT_SCHOOL_TRYASSIGN_GET: '',
	HR_RECRUIT_SCHOOL_TRYASSIGN_LIST_GET: '/_hr/applicant/school-assign/hr-index.json',
	_HR_RECRUIT_SCHOOL_TRYASSIGN_ALLOCATE_SETTING_POST: '/_hr/applicant/school-assign/save-assign-conf.json', // 试岗分配配置
	_HR_RECRUIT_SCHOOL_TRYASSIGN_ALLOCATE_RANDOM_GET: '/_hr/applicant/school-assign/random-assign-result.json', // 试岗分配结果（随机
	_HR_RECRUIT_SCHOOL_TRYASSIGN_ALLOCATE_CHIEF_GET: '/_hr/applicant/school-assign/manager-assign-result.json', // 试岗分配结果（总监
	_HR_RECRUIT_SCHOOL_TRYASSIGN_ALLOCATE_SAVE_POST: '/_hr/applicant/school-assign/save-assign-result.json', // 试岗分配结果保存
	_HR_RECRUIT_SCHOOL_TRYASSIGN_ALLOCATE_DISCONTINUE_SAVE_POST: '/_hr//applicant/school-assign/discontinue-assign.json', // 试岗分配结果 中止分配
	// 校招战区详情
	HR_RECRUIT_SCHOOL_WAR_GET: '',
	HR_RECRUIT_SCHOOL_WAR_LIST_GET: '/_hr/applicant/school-assign/big-depart-detail.json',
	// 校招部门分配
	HR_RECRUIT_SCHOOL_DEPART_GET: '',
	HR_RECRUIT_SCHOOL_DEPART_LIST_GET: '/_hr/applicant/school-assign/small-depart-detail.json',
	// 分配情况
	HR_RECRUIT_SCHOOL_ASSIGNDETAILS_GET: '',
	HR_RECRUIT_SCHOOL_ASSIGNDETAILS_LIST_GET: '/_hr/applicant/school-assign/assign-situation.json',
	// 组织人员
	HR_RECRUIT_SCHOOL_ORGANIZATION_GET: '',
	HR_RECRUIT_SCHOOL_ORGANIZATION_LIST_GET: '/_hr/applicant/school-assign/organization-people.json',
	// 社招
	HR_RECRUIT_SOCIAL_SUMMARY_GET: '',
	HR_RECRUIT_SOCIAL_SUMMARY_LIST_GET: '/_hr/applicant/applicant/index.json',
	// 社招淘汰
	HR_RECRUIT_SOCIAL_SUMMARY_PASS_POST: '/_hr/applicant/applicant/disuse.json',
	// 社招批量淘汰
	HR_RECRUIT_SOCIAL_SUMMARY_BATCH_DISUSE_POST: '/_hr/applicant/applicant/batch-disuse.json',
	// 社招变更
	HR_RECRUIT_SOCIAL_SUMMARY_CHANGE_POST: '/_hr/applicant/applicant/change-status.json',
	// 修改指派
	HR_RECRUIT_SOCIAL_SUMMARY_EDIT_DESIGNATE_POST: '/_hr/applicant/applicant/edit-design.json',
	HR_RECRUIT_SOCIAL_SUMMARY_EXPECT_INTERVIEW_POST: '/_hr/applicant/applicant/edit-predict-interview.json',
	HR_RECRUIT_SOCIAL_SUMMARY_TRAIN_WRITE_POST: '/_hr/applicant/applicant/write-train.json',
	HR_RECRUIT_SOCIAL_SUMMARY_SURVEY_BACKGROUND_POST: '/_hr/applicant/applicant/survey-background.json',
	_HR_RECRUIT_SOCIAL_SUMMARY_BACKGROUND_GET: '/_hr/applicant/applicant/get-background.json',
	// 继续面试
	HR_RECRUIT_SOCIAL_SUMMARY_KEEP_INTERVIEW_POST: '/_hr/applicant/applicant/continue-interview.json',
	// 指派试岗部门
	HR_RECRUIT_SOCIAL_SUMMARY_DESIGNATE_POST: '/_hr/applicant/applicant/design-try-depart.json',
	// 分配人员弹框
	HR_RECRUIT_SOCIAL_SUMMARY_ALLOCATE_LIST_GET: '/_hr/applicant/applicant/get-alert-list.json',
	HR_RECRUIT_SOCIAL_SUMMARY_ALLOCATE_POST: '/_hr/applicant/applicant/design.json',
	// 上次面试记录
	HR_RECRUIT_SOCIAL_INTERVIEW_INFO_GET: '/_hr/applicant/applicant/get-last-interview-info.json',
	// offer预览
	_HR_RECRUIT_SOCIAL_SUMMARY_OFFER_GET: '/_hr/applicant/applicant/send-offer.json',
	// 淘汰统计
	HR_RECRUIT_SOCIAL_TALENT_GET: '',
	HR_RECRUIT_SOCIAL_TALENT_LIST_GET: '/_hr/applicant/talents/index.json',
	// 应聘者删除
	HR_RECRUIT_APPLICANT_DEL_POST: '/_hr/applicant/school/delete-applicant.json',
	// 信息录入
	_HR_RECRUIT_SUMMARY_ADD_POST: '/_hr/applicant/applicant/add-info.json',
	_HR_RECRUIT_SUMMARY_ADD_CHECK_MOBILE_GET: '/_hr/applicant/applicant/find-applicant.json', // 试题预览
	// 淘汰统计恢复
	HR_RECRUIT_APPLICANT_RECOVER_POST: '/_hr/applicant/talents/recover.json',
	// 详情
	_HR_RECRUIT_APPLICANT_DETAIL_GET: '/_hr/applicant/applicant/detail.json',
	// 转化率统计
	HR_RECRUIT_SOCIAL_TRANSFORM_GET: '',
	HR_RECRUIT_SOCIAL_TRANSFORM_LIST_GET: '/_hr/applicant/social-statistics/social-transform.json',
	HR_RECRUIT_SOCIAL_POSITION_ANALYZE_LIST_GET: '/_hr/applicant/position-analyze/index.json',
	_HR_RECRUIT_SOCIAL_POSITION_ANALYZE_FIND_GET: '/_hr/applicant/position-analyze/find-position.json',
	_HR_RECRUIT_SOCIAL_POSITION_ANALYZE_ADD_GET: '/_hr/applicant/position-analyze/add.json',
	HR_RECRUIT_SOCIAL_STATISTICS_POSITION_DETAILS_LIST_GET: '/_hr/applicant/position-analyze/detail.json',

	// 社招统计
	HR_RECRUIT_SOCIAL_STATISTICS_LIST_GET: '/_hr/applicant/social-statistics/social-applicant-data.json',
	HR_RECRUIT_SOCIAL_FOLLOW_LIST_GET: '/_hr/applicant/social-statistics/index.json',
	HR_RECRUIT_SOCIAL_STATISTICS_DETAIL_LIST_GET: '/_hr/applicant/social-statistics/social-applicant-data-detail.json',
	HR_RECRUIT_SOCIAL_ENTRY_TENDENCY_LIST_GET: '/_hr/applicant/social-statistics/entry-tendency.json',
	HR_RECRUIT_INTERVIEWER_STATISTICS_LIST_GET: '/_hr/applicant/social-statistics/interviewer-data.json',
	HR_RECRUIT_INTERVIEWER_RECORD_GET: '/_hr/applicant/social-statistics/interview-record-data.json',
	_HR_RECRUIT_SCHOOL_SCENARIO_DEPART_GET: '/_hr/applicant/school-assign/try-depart-list.json',
	HR_RECRUIT_SOCIAL_SOCIAL_TRANSFORM_DETAILS_LIST_GET: '/_hr/applicant/social-statistics/social-transform-detail.json',
	HR_RECRUIT_SOCIAL_SOCIAL_NEED_POSITION_LIST_GET: '/_hr/applicant/position-analyze/need-index.json',
	_HR_RECRUIT_SCHOOL_NEED_POSITION_ADD_POST: '/_hr/applicant/need-position/add.json',
	_HR_RECRUIT_SCHOOL_NEED_DETAIL_GET: '/_hr/applicant/need-position/need-detail.json',
	_HR_RECRUIT_SCHOOL_RECRUIT_DETAIL_GET: '/_hr/applicant/need-position/count-detail.json', // 招聘人数
	_HR_RECRUIT_SCHOOL_NEED_POSITION_OPERATE_GET: '/_hr/applicant/need-position/operate.json',
	HR_RECRUIT_SOCIAL_BLACKLIST_LIST_GET: '/_hr/human/black-list/list.json',
	_HR_RECRUIT_SOCIAL_BLACKLIST_CHECK_MOBILE_GET: '/_hr/human/black-list/check-mobile.json',
	_HR_RECRUIT_SOCIAL_BLACKLIST_ADD_GET: '/_hr/human/black-list/add.json',
	_HR_RECRUIT_SOCIAL_BLACKLIST_REMOVE_GET: '/_hr/human/black-list/remove.json',

	/**
	 * 员工管理
	 */
	// summary
	HR_SUMMARY_GET: '',
	HR_EMPLOYEE_TRANSFER_GET: '/_hr/human/staff-information/job-apply.json',
	_HR_EMPLOYEE_DIMISSION_GET: '/_hr/human/staff-information/leave-apply.json', // 办理离职
	HR_EMPLOYEE_SUMMARY_LIST_GET: '/_hr/human/staff/list.json',
	HR_EMPLOYEE_SUMMARY_CHECK_MOBILE_GET: '/_hr/human/staff/check-mobile.json',

	_HR_EMPLOYEE_SUMMARY_RESUME_BLOOD_GET: '/_hr/human/staff/get-blood.json', // 获取血型
	_HR_EMPLOYEE_SUMMARY_RESUME_CONSTELLATION_GET: '/_hr/human/staff/get-constellation.json', // 获取星座
	_HR_EMPLOYEE_SUMMARY_RESUME_NATIONS_GET: '/_hr/human/staff/get-nations.json', // 获取民族
	_HR_EMPLOYEE_SUMMARY_RESUME_EDUCATION_GET: '/_hr/human/staff/get-education.json', // 获取学历
	_HR_EMPLOYEE_SUMMARY_RESUME_ABILITY_GET: '/_hr/human/staff/get-level.json', // 获取计算机和外语能力下拉选择
	_HR_EMPLOYEE_SUMMARY_RESUME_IMPRESSION_GET: '/_hr/human/staff/get-impression.json', // 获取前台印象下拉选择
	_HR_EMPLOYEE_SUMMARY_RESUME_RESUME_POST: '/_hr/human/staff/add-resume-info.json', // 完善简历和编辑简历
	_HR_EMPLOYEE_SUMMARY_CHECK_RESUME_GET: '/_hr/human/staff/get-resume-info.json', // 查看简历详情
	_HR_EMPLOYEE_SUMMARY_RESUME_POSITION_GET: '/_hr/human/staff/get-all-position.json', // 获取所有的职位
	_HR_EMPLOYEE_SUMMARY_PROFILE_DETAILS_GET: '/_hr/human/staff/get-information-detail.json', // 获取资料详情
	_HR_EMPLOYEE_SUMMARY_PROFILE_EIND_INFO_POST: '/_hr/human/staff/edit-information.json', // 完善资料和编辑入职资料
	_HR_EMPLOYEE_SUMMARY_ENTRY_DETAIL_GET: '/_hr/human/staff/apply-entry-detail.json', // 获取入职资料
	_HR_EMPLOYEE_SUMMARY_ENTRY_EDIT_DETAIL_GET: '/_hr/human/staff/entry-detail.json', // 编辑入职资料

	_HR_EMPLOYEE_SUMMARY_ENTRY_POST: '/_hr/human/staff/apply-entry.json', // 办理入职或入职信息编辑
	_HR_EMPLOYEE_SUMMARY_ENTRY_NEW_DEPART_ID_GET: '/_hr/api/human/get-current-top-depart-id.json', // 从头像进入个人信息获取顶级部门id
	_HR_EMPLOYEE_SUMMARY_DETAILS_HEADER_GET: '/_hr/human/staff-information/staff-basic-info.json', // 个人资料 共用头部
	_HR_EMPLOYEE_SUMMARY_DETAILS_JOB_INFO_GET: '/_hr/human/staff-information/staff-job-info.json', // 个人资料 获取在职信息
	_HR_EMPLOYEE_SUMMARY_DETAILS_AVATAR_INFO_POST: '/_hr/human/staff/head-img.json', // 个人资料 获取在职信息
	_HR_EMPLOYEE_SUMMARY_DETAILS_EDIT_JOB_INFO_POST: '/_hr/human/staff-information/edit-staff-job-info.json', // 个人资料 编辑在职信息
	_HR_EMPLOYEE_SUMMARY_DETAILS_CONTRACT_LIST_GET: '/_hr/human/staff-information/staff-contract-list.json', // 个人资料 获取合同列表
	_HR_EMPLOYEE_SUMMARY_DETAILS_CONTRACT_COMPANY_POST: '/_hr/human/staff-information/add-contract-company.json', // 个人资料 添加或编辑合同公司
	_HR_EMPLOYEE_SUMMARY_DETAILS_RELIEVE_CONTRACT_POST: '/_hr/human/staff-information/relieve-contract.json', // 个人资料 解除合同
	_HR_EMPLOYEE_SUMMARY_DETAILS_ADD_COMPANY_POST: '/_hr/human/staff-information/add-company.json', // 个人资料 添加公司
	_HR_EMPLOYEE_SUMMARY_DETAILS_SOCIAL_SECURITY_GET: '/_hr/human/staff-information/social-security-info.json', // 个人资料 工资社保详情
	_HR_EMPLOYEE_SUMMARY_DETAILS_WARN_MSG_GET: '/_hr/human/salary/warn-msg.json', // 个人资料 工资社保提示语
	_HR_EMPLOYEE_SUMMARY_DETAILS_EDIT_SOCIAL_SECURITY_POST: '/_hr/human/staff-information/edit-social-security.json', // 个人资料 工资社保保存
	_HR_EMPLOYEE_SUMMARY_DETAILS_HEADER_MODIFY_PWD_POST: '/_hr/human/staff/modify-pwd.json', // 个人资料 更改密码
	_HR_EMPLOYEE_SUMMARY_DETAILS_GET_RATE_NAME_GET: '/_hr/human/staff-information/get-rate-name.json', // 个人资料 提成名称
	_HR_EMPLOYEE_SUMMARY_DETAILS_GET_MY_RATE_GET: '/_hr/human/staff-information/my-rank.json', // 个人资料  我的晋级-详情（晋级体系）
	_HR_EMPLOYEE_SUMMARY_DETAILS_EDIT_MY_RATE_GET: '/_hr/human/staff-information/edit-my-rank.json', // 个人资料  我的晋级-详情（晋级体系）
	HR_EMPLOYEE_SCORE_SERVICE_COMPLAINTS_LIST_GET: '/_sc/sale/apply/performance-get-appeal-list.json', // 申诉审核
	_HR_EMPLOYEE_SCORE_SERVICE_APPLY_DETAIL_GET: '/_sc/sale/apply/get-apply-service-detail.json', // 获取审核详情）

	_HR_EMPLOYEE_SUMMARY_DETAILS_BASIC_SALARY_GET: '/_hr/human/staff-information/get-basic-salary-name-list.json', // 个人资料 底薪设置列表
	_HR_EMPLOYEE_SUMMARY_DETAILS_RATE_CASE_GET: '/_hr/human/staff-information/get-rate-case-name-list.json', // 个人资料 提成设置列表
	_HR_EMPLOYEE_SUMMARY_DETAILS_RESIDENCE_GET: '/_hr/human/staff-information/get-residence.json', // 个人资料 户口性质列表
	_HR_EMPLOYEE_SUMMARY_DETAILS_PREV_NEXT_BTN_GET: '/_hr/human/staff-information/prev-or-next-staff-info.json', // 个人资料 职能履历左右切换按钮
	_HR_EMPLOYEE_SUMMARY_DETAILS_RANK_SELECT_GET: '/_hr/human/staff-information/rank-select.json', // 个人资料 称号履历下拉
	_HR_EMPLOYEE_SUMMARY_DETAILS_TITLE_RECORD_GET: '/_hr/human/staff-information/title-record.json', // 个人资料 称号履历
	_HR_EMPLOYEE_SUMMARY_DETAILS_RANK_SYSTEM_GET: '/_hr/human/staff-information/rank-system.json', // 个人资料 称号履历
	_HR_EMPLOYEE_SUMMARY_DETAILS_RANK_RECORD_GET: '/_hr/human/staff-information/rank-record.json', // 个人资料 晋级履历
	_HR_EMPLOYEE_SUMMARY_DETAILS_POLITICS_STATUS_GET: '/_hr/human/other/get-politics-status.json', // 个人资料 政治面貌
	_HR_EMPLOYEE_JOB_APPLY_POST: '/_hr/human/staff-information/job-apply.json', // 个人资料 晋级履历
	_HR_EMPLOYEE_PRO_INFO_GET: '/_hr/human/pro-info/pro-info.json', // 个人资料 晋级履历
	_HR_EMPLOYEE_SCORE_SERVICE_AUTO_GET: '/_sc/sale/apply/audit-service.json', // 审核服务申请
	_HR_EMPLOYEE_PRO_INFO_PRO_SYSTEM_GET: '/_hr/human/pro-info/pro-system.json', // 个人资料 晋级履历
	_HR_EMPLOYEE_PRO_INFO_PRO_RESUME_GET: '/_hr/human/pro-info/pro-resume.json',
	_HR_EMPLOYEE_SCHOOL_ASSIGN_APPLICANT_RESUME_GET: '/_hr/applicant/school-assign/school-assign-applicant-detail.json',





	HR_EMPLOYEE_SUMMARY_RESUME_GET: '',
	HR_EMPLOYEE_SUMMARY_PROFILE_GET: '',
	HR_EMPLOYEE_SUMMARY_ENTRY_GET: '',
	HR_EMPLOYEE_SUMMARY_DETAILS_GET: '',
	_HR_EMPLOYEE_RELATION_TRAN_DETAIL_GET: '/_hr/human/transfer/detail.json',

	// 服务审核
	HR_EMPLOYEE_SCORE_SERVICE_EXAMINE_LIST_GET: '/_sc/sale/stage/service-record-audit-list.json', // 列表
	_HR_EMPLOYEE_SCORE_SERVICE_EXAMINE_SERVICE_LIST_GET: '/_sc/center/performance/service-list.json', // 服务审核列表
	_HR_EMPLOYEE_SCORE_SERVICE_EXAMINE_INTEGRAL_LIST_GET: '/_sc/center/performance/integral-service-list.json', // 回款审核列表
	_HR_EMPLOYEE_SCORE_SERVICE_EXAMINE_SERVICE_INFO_GET: '/_sc/center/performance/service-info.json', // 合同服务情况
	_HR_EMPLOYEE_SCORE_SERVICE_EXAMINE_SERVICE_RECORD_AUDIT_GET: '/_sc/sale/stage/service-audit-export.json', // 导出

	_HR_EMPLOYEE_SCORE_SERVICE_EXAMINE_CHECK_GET: '/_sc/center/performance/check.json', // 服务审核

	// relation
	// 转正确认接口
	_HR_EMPLOYEE_RELATION_TRY_CONFIRM_GET: '/_hr/human/regular/confirm.json',
	// 转正未通过接口
	_HR_EMPLOYEE_RELATION_TRY_FAIL_GET: '/_hr/human/regular/reject.json',
	// 新增转岗
	_HR_EMPLOYEE_RELATION_TRAN_ADD_POST: '/_hr/human/transfer/add.json',
	// 转岗确认
	_HR_EMPLOYEE_RELATION_TRAN_CONFIRM_GET: '/_hr/human/transfer/confirm.json',
	// 转岗删除
	_HR_EMPLOYEE_RELATION_TRAN_DELETE_GET: '/_hr/human/transfer/del.json',
	// 新增离职
	_HR_EMPLOYEE_RELATION_LEAVE_ADD_POST: '/_hr/human/leave/add.json',
	// 离职确认
	_HR_EMPLOYEE_RELATION_LEAVE_CONFIRM_GET: '/_hr/human/leave/confirm.json',
	// 离职删除
	_HR_EMPLOYEE_RELATION_LEAVE_DELETE_GET: '/_hr/human/leave/del.json',
	// 获取单据tab
	_HR_EMPLOYEE_RELATION_INVOICE_TAB_GET: '/_hr/human/template/temp-tab.json',
	// 获取单据附件
	_HR_EMPLOYEE_RELATION_INVOICE_FILE_POST: '/_hr/human/template/get-invoices-url.json',
	// 保存单据附件
	_HR_EMPLOYEE_INVOICE_FILE_SAVE_POST: '/_hr/human/template/add-invoices-url.json',
	// 删除单据附件
	_HR_EMPLOYEE_INVOICE_FILE_DELETE_POST: '/_hr/human/template/del-invoices-url.json',

	// 转正列表
	HR_EMPLOYEE_RELATION_TRY_LIST_GET: '/_hr/human/regular/list.json',
	// 合同列表
	HR_EMPLOYEE_RELATION_PACT_LIST_GET: '/_hr/human/regular/contract.json',
	// 转岗列表
	HR_EMPLOYEE_RELATION_TRAN_LIST_GET: '/_hr/human/transfer/list.json',
	// 离职列表
	HR_EMPLOYEE_RELATION_LEAVE_LIST_GET: '/_hr/human/leave/list.json',

	// 晋级列表
	HR_EMPLOYEE_RANK_PROMO_LIST_GET: '/_hr/human/promotion/list.json',
	// 阶段下拉
	_HR_EMPLOYEE_RANK_PROMO_PERIOD_GET: '/_hr/human/promotion/period.json',
	// 级称下拉
	_HR_EMPLOYEE_RANK_PROMO_RANK_GET: '/_hr/human/promotion/rank.json',
	// 获取级称名称
	_HR_EMPLOYEE_RANK_PROMO_RANK_NAME_GET: '/_hr/human/promotion/change-data.json',
	// 晋升晋级
	_HR_EMPLOYEE_RANK_PROMO_CHANGE_RANK_GET: '/_hr/human/promotion/change.json',

	// 晋级-操作历史
	HR_EMPLOYEE_RANK_PROMO_RECORD_GET: '',
	HR_EMPLOYEE_RANK_PROMO_RECORD_LIST_GET: '/_hr/human/promotion/history.json',

	// 称号体系
	HR_EMPLOYEE_RANK_TITLE_LIST_GET: '/_hr/human/promotion/list.json',
	// 称号调整
	_HR_EMPLOYEE_RANK_TITLE_ADJUST_GET: '/_hr/human/promotion/title-change.json',

	_HR_EMPLOYEE_PRO_INFO_STAFF_LIST_GET: '/_hr/human/pro-info/alert-staff-list.json',

	// 晋升
	// 晋升结果
	_HR_EMPLOYEE_UP_RESULT_GET: '/_hr/human/pro-record/get-pro-status.json',
	// 晋升周期年份
	_HR_EMPLOYEE_UP_YEAR_GET: '/_hr/human/pro-record/get-cycle-year.json',
	// 晋升周期
	_HR_EMPLOYEE_UP_CYCLE_GET: '/_hr/human/pro-record/get-cycle.json',
	// 是否显示添加候选人操作
	_HR_EMPLOYEE_UP_SHOW_ADD_GET: '/_hr/human/pro-record/get-is-edit.json',
	// 候选人列表
	_HR_EMPLOYEE_UP_ALERT_LIST_GET: '/_hr/human/pro-record/get-alert-list.json',
	// 添加候选人
	_HR_EMPLOYEE_UP_ADD_ALERT_POST: '/_hr/human/pro-record/add.json',
	// 根据职位和角色获取默认团队提成
	_HR_EMPLOYEE_UP_TEAM_BY_POS_ROLE_GET: '/_hr/human/pro-deploy/get-pos-role-by-position-id-and-role-id.json',
	// 判断晋升、降职、调整职位是否离开积分学分范围
	_HR_EMPLOYEE_UP_IS_RANGE_POST: '/_hr/human/pro-record/get-is-range.json',
	// 员工晋升
	_HR_EMPLOYEE_UP_PROMO_POST: '/_hr/human/pro-record/pro-status.json',
	// 员工降职
	_HR_EMPLOYEE_UP_DEMO_POST: '/_hr/human/pro-record/down-status.json',
	// 获取当前周期是否开启
	_HR_EMPLOYEE_UP_CYCLE_STATUS_GET: '/_hr/human/pro-record/get-is-start.json',
	// 开启评定
	_HR_EMPLOYEE_UP_START_CYCLE_POST: '/_hr/human/pro-record/start-cycle.json',
	// 编辑周期
	_HR_EMPLOYEE_UP_EDIT_CYCLE_POST: '/_hr/human/pro-record/edit-cycle.json',
	// 移除员工
	_HR_EMPLOYEE_UP_REMOVE_STAFF_POST: '/_hr/human/pro-record/remove-staff.json',
	// 保持原职、晋升待定
	_HR_EMPLOYEE_UP_KEEP_STATUS_POST: '/_hr/human/pro-record/keep-status.json',
	// 撤销评定
	_HR_EMPLOYEE_UP_REVOCATION_STATUS_POST: '/_hr/human/pro-record/revocation-status.json',
	// 获取晋升关系当前周期
	_HR_EMPLOYEE_UP_NOW_CYCLE_GET: '/_hr/human/pro-record/get-now-cycle-id.json',
	// 获取晋升关系详细规则
	_HR_EMPLOYEE_UP_RULE_DETAIL_GET: '/_hr/human/pro-rule/system-rule-detail-index.json',
	// 工龄类型下拉数据
	_HR_EMPLOYEE_UP_STABDING_TYPES_GET: '/_hr/human/pro-rule/get-standing-types.json',
	// 部门工龄类型下拉数据
	_HR_EMPLOYEE_UP_DEPART_STABDING_TYPES_GET: '/_hr/human/pro-rule/get-depart-standing-types.json',
	// 对象下拉数据
	_HR_EMPLOYEE_UP_OBJECT_GET: '/_hr/human/pro-rule/get-objects.json',
	// 排名范围下拉数据
	_HR_EMPLOYEE_UP_DEPART_RANKING_GET: '/_hr/human/pro-rule/get-depart-ranking-types.json',
	// 积分学分周期下拉数据
	_HR_EMPLOYEE_UP_STAT_PERIODS_GET: '/_hr/human/pro-rule/get-stat-periods.json',
	// 晋升规则-保存
	_HR_EMPLOYEE_UP_RULE_SAVE_POST: '/_hr/human/pro-rule/save-rule.json',
	// 晋升规则库
	_HR_EMPLOYEE_UP_RULE_DATABASE_GET: '/_hr/human/pro-rule/rule-database-index.json',
	// 规则库-新增
	_HR_EMPLOYEE_UP_RULE_DATABASE_ADD_POST: '/_hr/human/pro-rule/add-man-made-rule.json',
	// 规则库-删除
	_HR_EMPLOYEE_UP_RULE_DATABASE_DELETE_POST: '/_hr/human/pro-rule/delete-man-made-rule.json',
	// 晋升tab
	HR_UP_RELATION_GET: '/_hr/human/pro-record/system-list.json',
	// 晋升体系列表
	HR_EMPLOYEE_RANK_UP_LIST_GET: '/_hr/human/pro-record/index.json',
	// 人才统计-职位列表
	HR_STATISTICS_POSITION_GET: '/_hr/human/talent-statistics/position-list.json',
	// 人才统计-人才列表
	HR_EMPLOYEE_RANK_STATISTICS_LIST_GET: '/_hr/human/talent-statistics/talent-list.json',
	// 人才统计-调整职位
	HR_EMPLOYEE_RANK_STATISTICS_ADJUST_POST: '/_hr/human/talent-statistics/adjust-position.json',

	// employee-data
	HR_EMPLOYEE_DATA_BASIC_GET: '/_hr/human/analysis/base.json',
	HR_EMPLOYEE_DATA_EMDATA_GET: '/_hr/human/analysis/collection.json',
	HR_EMPLOYEE_DATA_COMMISSAR_MANAGE_GET: '/_hr/file/staff-file/manage-data-analysis.json',
	HR_EMPLOYEE_DATA_COMMISSAR_POSITION_GET: '/_hr/file/staff-file/position-data-analysis.json',
	// 数据导出
	_HR_EMPLOYEE_DATA_EMDATA_OUTPUT_GET: '/_hr/human/analysis/export.json',
	// 离职分析
	_HR_EMPLOYEE_LEAVE_DATA_GET: '/_hr/human/analysis/leave.json',

	/**
	 * 薪资补贴
	 */
	// 获取操作提示语
	_HR_SALARY_ACTION_TIP_GET: '/_hr/human/salary/warn-msg.json',
	// 每月薪资
	HR_SALARY_WAGE_MONTHLY_LIST_GET: '/_hr/human/salary/list.json',
	// 调整薪资名称
	_HR_SALARY_WAGE_MONTHLY_ADJUST_POST: '/_hr/human/salary/change.json',
	// 调整历史
	HR_SALARY_WAGE_HISTORY_LIST_GET: '/_hr/human/salary/history.json',
	// 调整历史-撤销操作
	_HR_SALARY_WAGE_HISTORY_CANCEL_GET: '/_hr/human/salary/cancel.json',
	// 交通补贴
	HR_SALARY_SUBSIDY_TRAFFIC_LIST_GET: '/_hr/human/subsidy/list.json',
	// 交通补贴新增
	_HR_SALARY_SUBSIDY_TRAFFIC_ADD_GET: '/_hr/human/subsidy/change.json',

	// 获取底薪列表
	HR_SALARY_BASE_LIST_GET: '/_hr/human/salary/basic-list.json',
	// 获取体系列表
	HR_SALARY_RANK_SYS_GET: '/_hr/human/salary/rank-list.json',
	// 底薪制度检查名称
	_HR_SALARY_CHECK_BASE_NAME_GET: '/_hr/human/salary/basic-check.json',
	// 新增、修改底薪制度
	_HR_SALARY_ADD_BASE_GET: '/_hr/human/salary/basic-change.json',
	// 获取底薪制度详情
	_HR_SALARY_BASE_DEATIL_GET: '/_hr/human/salary/basic-detail.json',
	// 删除底薪制度
	_HR_SALARY_DELETE_BASE_GET: '/_hr/human/salary/basic-del.json',

	// 获取提成列表
	HR_SALARY_PER_LIST_GET: '/_hr/human/salary/rate-list.json',
	// 提成制度详情
	_HR_SALARY_PER_DETAIL_GET: '/_hr/human/salary/rate-detail.json',
	// 删除提成制度
	_HR_SALARY_DELETE_PER_GET: '/_hr/human/salary/rate-del.json',
	// 检查提成名称
	_HR_SALARY_CHECK_PER_NAME_GET: '/_hr/human/salary/rate-check.json',
	// 新增、修改提成制度
	_HR_SALARY_ADD_PER_GET: '/_hr/human/salary/rate-change.json',


	// 获取团队提成列表
	HR_SALARY_TEAM_LIST_GET: '/_hr/human/salary/rate-list.json',


	/**
	 * 三立学府
	 */
	// 变更状态
	_HR_ACADEMY_TRANSFER_CHANGE_STATUS_GET: '/_hr/train/recruiting/change-status.json',
	// 人才来源
	_HR_ACADEMY_TRANSFER_TALENT_RESOURCE_GET: '/_hr/train/try-statistics/get-talent-resources.json',
	// 获取项目时段
	_HR_ACADEMY_TRANSFER_PROJECT_TIME_GET: '/_hr/train/recruiting/project-list.json',
	// 获取项目对应的课程列表
	_HR_ACADEMY_TRANSFER_COURSE_BY_PROJECT_GET: '/_hr/train/recruiting/get-course-by-project-id.json',
	// 新增课程
	_HR_ACADEMY_TRANSFER_COURSE_ADD_POST: '/_hr/train/recruiting/staff-course-save.json',
	// 修改课程
	_HR_ACADEMY_TRANSFER_COURSE_UPDATE_POST: '/_hr/train/recruiting/staff-course-update.json',
	// 删除课程
	_HR_ACADEMY_TRANSFER_COURSE_DELETE_POST: '/_train/api/staff-course/delete.json',
	// 获得员工参与课程
	_HR_ACADEMY_TRANSFER_EMPLOYEE_COURSE_GET: '/_hr/train/recruiting/get-staff-course.json',
	// 新人输送列表.
	HR_ACADEMY_TRANSFER_TRANSFER_LIST_GET: '/_hr/train/recruiting/index.json',
	// 招聘来源试岗数据
	HR_ACADEMY_TRANSFER_STATISTIC_TRY_RECRUIT_GET: '/_hr/train/try-statistics/try-data-applicant.json',
	// 组织部门试岗数据
	HR_ACADEMY_TRANSFER_STATISTIC_TRY_ORGANIZATION_GET: '/_hr/train/try-statistics/try-data-depart.json',
	// 试岗数据详情
	HR_ACADEMY_TRANSFER_TRY_DETAIL_LIST_GET: '/_hr/train/try-statistics/try-data-detail.json',
	// 流失数据详情
	HR_ACADEMY_TRANSFER_STATISTIC_LOSS_GET: '/_hr/train/lose-data/lose-by-try.json',
	// 讲师数据
	HR_ACADEMY_TRANSFER_STATISTIC_TEACHER_LIST_GET: '/_hr/train/lecture-statistics/lecture-course.json',
	// 讲师数据详情
	HR_ACADEMY_TRANSFER_TEACHER_DETAIL_LIST_GET: '/_hr/train/lecture-statistics/lecture-course-detail.json',
	// 需求统计
	HR_ACADEMY_TRANSFER_STATISTIC_DEMAND_LIST_GET: '/_hr/train/need-position-statistics/index.json',
	// 需求统计数据详情
	HR_ACADEMY_TRANSFER_DEMAND_DETAIL_LIST_GET: '/_hr/train/need-position-statistics/need-detail.json',
	// 修改需求职位
	HR_ACADEMY_TRANSFER_STATISTIC_DEMAND_MODIFY_POST: '/_hr/train/need-position/add.json',
	// 根据职位获取需求数据
	HR_ACADEMY_TRANSFER_DEMAND_BY_POSITION_GET: '/_hr/train/need-position-statistics/get-need-info.json',
	// 导入
	HR_ACADEMY_TRANSFER_STATISTIC_DEMAND_INPUT_GET: '/_hr/train/need-position-statistics/import-need.json',
	// 导出模板
	HR_ACADEMY_TRANSFER_STATISTIC_DEMAND_OUTPUT_GET: '/_hr/train/need-position-statistics/download-template.json',


	/**
	 * 服务积分
	 */
	HR_POINTS_GET: '',
	HR_POINTS_CONFIRM_GET: '',
	// 积分确认列表
	HR_POINTS_CONFIRM_LIST_GET: '/_sc/center/integration/integration-list.json',
	HR_POINTS_COMPLAINT_GET: '',
	// 投诉列表
	HR_POINTS_COMPLAINT_LIST_GET: '/_sc/center/integration/complain-list.json',
	// 删除投诉列表
	_HR_POINTS_COMPLAINT_DELETE_POST: '/_sc/center/integration/delete-complain.json',
	// 获取上两级上司数据
	_HR_POINTS_COMPLAINT_DEFAULT_LIST_GET: '/_hr/api/human/get-lowest-two-leader.json',
	// 获取投诉人
	_HR_POINTS_COMPLAINT_CPERSON_LIST_GET: '/_hr/api/human/search-staff-info.json',
	// 获取投诉部门
	_HR_POINTS_COMPLAINT_CPART_LIST_GET: '/_hr/api/human/search-depart-info.json',


	// 客户信息
	_HR_POINT_CUSTOMER_INFO_GET: '/_sc/center/check/customer-info.json',
	// 服务审核
	_HR_POINT_SERVICE_AUDIT_GET: '/_sc/center/integration/integration-info.json',
	_HR_POINT_SERVICE_AUDIT_POST: '/_sc/center/integration/integration-confirm.json',
	// 投诉记录
	_HR_POINT_COMPLAINTLIST_LIST_GET: '/_sc/center/integration/complain-record.json',
	_HR_POINT_COMPLAINTLIST_ADD_POST: '/_sc/center/integration/add-complain.json',
	_HR_POINT_COMPLAINTLIST_DELETE_POST: '/_sc/center/integration/delete-complain.json',
	_HR_POINT_COMPLAINTLIST_EDIT_POST: '/_sc/center/integration/edit-complain.json',

	// 积分确认
	_HR_POINTS_CONFIRM_ALLOCATE_LIST_GET: '/_sc/api/set/get-staffs.json',
	_HR_POINTS_CONFIRM_ALLOCATE_POST: '/_sc/center/integration/assign.json',

	/**
	 * 角色管理
	 */
	HR_ROLE_GET: '',
	HR_ROLE_LIST_GET: '/_auth/auth/role/list.json',
	_HR_ROLE_FUNCTION_GET: '/_auth/auth/role/function.json',
	_HR_ROLE_ROLE_EDIT_POST: '/_auth/auth/role/edit.json',
	_HR_ROLE_ROLE_DELETE_POST: '/_auth/auth/role/del.json',
	_HR_ROLE_ROLE_DETAIL_GET: '/_auth/auth/role/detail.json',
	// 总表 新增入职
	HR_SUMMARY_STAFF_ADD_POST: '/_hr/human/staff/add.json',
	_HR_SUMMARY_STAFF_ADD_RULE_POST: '/_hr/human/pro-info/audit-rule.json',

	/**
	 * 组织架构
	 */
	_HR_ORGANIZATION_INFO_GET: '/_hr/human/depart/get-info.json',

	HR_ORGANIZATION_GET: '',
	HR_ORGANIZATION_LIST_GET: '/_hr/human/depart/index.json',
	HR_ORGANIZATION_DEL_POST: '/_hr/human/depart/del.json',
	HR_ORGANIZATION_EDIT_POST: '/_hr/human/depart/update.json',
	HR_ORGANIZATION_ADD_POST: '/_hr/human/depart/add.json',
	_HR_ORGANIZATION_COMPANY_GET: '/_hr/human/depart/get-contract-company.json',
	_HR_ORGANIZATION_SORT_GET: '/_hr/human/depart/check-sort.json',

	/**
	 * 职位设置
	 */
	HR_POSITION_GET: '',
	HR_POSITION_LIST_GET: '/_hr/human/position/list.json',
	HR_POSITION_ADD_POST: '/_hr/human/position/add.json',
	HR_POSITION_DEL_POST: '/_hr/human/position/del.json',
	HR_POSITION_LIST_TABLE_GET: '/_hr/human/position/list-table.json',


	/**
	 * 级称设置
	 */
	HR_RANK_GET: '',
	HR_RANK_LIST_GET: '/_hr/human/rank/rank-list.json',
	HR_RANK_DEL_POST: '/_hr/human/rank/del-system.json',
	HR_RANK_INFO_GET: '',
	_HR_RANK_INFO_GET: '/_hr/human/rank/edit-info.json',
	_HR_RANK_INFO_SAVE_POST: '/_hr/human/rank/save-system.json',
	_HR_RANK_INFO_VALIDATE_NAME_GET: '/_hr/human/rank/check-duplication.json',
	_HR_RANK_SETTING_GET: '/_hr/human/rank/rank-set.json',
	_HR_RANK_SETTING_SAVE_POST: '/_hr/human/rank/set-rules.json',
	_HR_SYSTEM_SELECT_DATA_GET: '/_hr/human/rank/system-select.json',
	HR_RECRUIT_SOCIAL_SUMMARY_ADD_GET: '',
	HR_RECRUIT_SCHOOL_SUMMARY_ADD_GET: '',
	HR_RECRUIT_SCHOOL_SUMMARY_DETAIL_GET: '',
	HR_RECRUIT_SOCIAL_SUMMARY_DETAILS_GET: '',

	/**
	 * 常用工具
	 */
	HR_TOOL_WORKFLOW_GET: '/_hr/human/document/process-list.json',
	_HR_TOOL_WORKFLOW_INFO_GET: '/_hr/human/document/conf-detail.json',
	_HR_TOOL_WORKFLOW_LINK_GET: '/_hr/human/document/link-document-select.json',
	HR_TOOL_WORKFLOW_SAVE_POST: '/_hr/human/document/conf-depart-form.json',
	HR_TOOL_MODULES_OFFER_GET: '/_hr/human/document/offer-list.json',
	_HR_TOOL_MODULES_OFFER_DOWNLOAD_GET: '/_hr/human/document/down.json',
	_HR_TOOL_MODULES_ADD_OFFER_POST: '/_hr/human/document/add-offer.json',
	_HR_TOOL_MODULES_DEL_OFFER_POST: '/_hr/human/document/del-offer.json',
	_HR_TOOL_MODULES_OFFER_DETAIL_GET: '/_hr/human/document/offer-detail.json',
	HR_TOOL_MODULES_UPLOAD_GET: '/_hr/human/document/document-list.json',
	_HR_TOOL_MODULES_ADD_UPLOAD_POST: '/_hr/human/document/upload-document.json',
	_HR_TOOL_MODULES_DEL_UPLOAD_POST: '/_hr/human/document/del-document.json',
	HR_TOOL_MODULES_OFFER_THEME_LIST_GET: '/_hr/human/document/offer-theme-list.json', // offer正文配置 — 列表
	HR_TOOL_MODULES_OFFER_THEME_ADD_GET: '/_hr/human/document/offer-theme-add.json', // offer正文配置 — 保存
	HR_TOOL_MODULES_OFFER_THEME_IS_OPEN_GET: '/_hr/human/document/offer-theme-is-open.json', // offer正文配置 — 开启/关闭

	/**
	 * 表单
	 */
	// 面试记录单
	_HR_FORM_INTERVIEW_GET: '/_hr/human/template/get-interview-record-form.json',
	_HR_FORM_INTERVIEW_POST: '/_hr/human/template/interview-record-form.json',
	// 入职面谈单获取&保存
	_HR_FORM_ENTER_TALK_GET: '/_hr/human/template/entry-interview-info.json',
	_HR_FORM_ENTER_TALK_POST: '/_hr/human/template/entry-interview.json',
	// 入职登记表 获取&保存
	_HR_FORM_ENTER_REGISTER_GET: '/_hr/human/other/entry-register-info.json',
	_HR_FORM_ENTER_REGISTER_POST: '/_hr/human/other/entry-register.json',
	_HR_FORM_ALL_DEPARTS_GET: '/_hr/human/other/depart-all.json',
	_HR_FORM_ENTER_POSITION_GET: '/_hr/human/other/position-list.json',
	// 转正申请 获取&保存
	_HR_FORM_REGULAR_APPLY_GET: '/_hr/human/template/temp-get.json',
	_HR_FORM_REGULAR_APPLY_POST: '/_hr/human/template/temp-post.json',
	// 转正面谈 获取&保存
	_HR_FORM_REGULAR_TALK_GET: '/_hr/human/template/temp-get.json',
	_HR_FORM_REGULAR_TALK_POST: '/_hr/human/template/temp-post.json',
	// 离职申请 获取&保存
	_HR_FORM_DIMISSION_APPLY_GET: '/_hr/human/template/temp-get.json',
	_HR_FORM_DIMISSION_APPLY_POST: '/_hr/human/template/temp-post.json',
	// 离职面谈 获取&保存
	_HR_FORM_DIMISSION_TALK_GET: '/_hr/human/template/temp-get.json',
	_HR_FORM_DIMISSION_TALK_POST: '/_hr/human/template/temp-post.json',

	_HR_STAFF_LIST_GET: '/_hr/human/staff/staff-list.json', // @人员列表
	// 是否是入职的手机号
	_HR_FORM_ENTER_VALID_MOBILE_POST: '/_hr/mobile/applicant/check-entry.json',

	/**
	 * Offer下载
	 */
	_HR_OFFER_DOWNLOAD_POST: '/_hr/applicant/applicant/download-offer.json',
	HR_EMPLOYEE_SCORE_INTEGRATION_GET: '',
	HR_EMPLOYEE_SCORE_CREDIT_GET: '',

	// 员工考勤
	HR_EMPLOYEE_CHECK_GET: '',
	HR_EMPLOYEE_CHECK_LIST_GET: '/_hr/human/attendance/list.json',
	_HR_EMPLOYEE_CHECK_ADD_POST: '/_hr/human/attendance/add.json',
	_HR_EMPLOYEE_CHECK_DEL_POST: '/_hr/human/attendance/del.json',
	_HR_EMPLOYEE_CHECK_STATISTIC_IMPORT_POST: '/_hr/human/attendance/import-attendance.json',
	_HR_EMPLOYEE_CHECK_STATISTIC_DOWNLOAD_GET: '/_hr/human/attendance/download-template.json',

	// 积分学分
	_HR_EMPLOYEE_CI_DEPART_SON_GET: '/_hr/human/depart/get-depart-son-tree.json',
	HR_EMPLOYEE_INTEGRATION_TABS_GET: '/_hr/train/integral/get-tab.json', // 积分tab
	HR_EMPLOYEE_CREDIT_TABS_GET: '/_hr/train/integral/get-tab.json', // 学分tab
	HR_EMPLOYEE_SCORE_INTEGRATION_LIST_GET: '/_hr/train/integral/ic-list.json',
	HR_EMPLOYEE_SCORE_CREDIT_LIST_GET: '/_hr/train/integral/ic-list.json',
	_HR_EMPLOYEE_SCORE_INTEGRATION_TITLE_GET: '/_hr/train/integral/get-types-by-year.json',
	HR_EMPLOYEE_SCORE_CREDIT_AUDIT_GET: '',
	HR_EMPLOYEE_SCORE_CREDIT_AUDIT_LIST_GET: '/_hr/train/credit/audit-list.json',
	_HR_EMPLOYEE_SCORE_CREDIT_AUDIT_POST: '/_hr/train/credit/multi-audit.json',
	_HR_EMPLOYEE_SCORE_CREDIT_AUDIT_DETAIL_GET: '/_hr/train/credit/apply-detail.json', // 学分审核详情
	_HR_EMPLOYEE_SCORE_CREDIT_AUDIT_APPLY_POST: '/_hr/train/credit/apply-audit.json', // 详情审核
	HR_EMPLOYEE_SCORE_CREDIT_RANK_TABS_GET: '/_hr/train/integral/get-tab.json', // 学分排名tab
	HR_EMPLOYEE_SCORE_INTEGRATION_RANK_TABS_GET: '/_hr/train/integral/get-tab.json', // 积分排名tab
	HR_EMPLOYEE_SCORE_INTEGRATION_AUDIT_LIST_GET: '/_hr/train/integral/integral-audit-list.json',
	HR_EMPLOYEE_STAFF_TWO_DEPART_SELECT_BY_GET: '/_hr/human/staff/two-depart-select-by-staff-id.json', // 所在战区
	HR_EMPLOYEE_SCORE_CREDIT_RANK_GET: '',
	HR_EMPLOYEE_SCORE_CREDIT_RANK_LIST_GET: '/_hr/train/integral/ic-rank.json',
	HR_EMPLOYEE_SCORE_INTEGRATION_RANK_LIST_GET: '/_hr/train/integral/ic-rank.json',
	HR_EMPLOYEE_SCORE_CREDIT_DETAIL_GET: '',
	HR_EMPLOYEE_SCORE_INTEGRATION_RANK_GET: '',
	HR_EMPLOYEE_SCORE_INTEGRATION_DETAIL_GET: '',
	HR_EMPLOYEE_SCORE_INTEGRATION_AUDIT_GET: '/_hr/integral/integral-audit-list.json',
	_HR_EMPLOYEE_SCORE_CREDITINTE_GOAL_GET: '/_hr/train/integral/detail.json',
	_HR_EMPLOYEE_SCORE_CREDITINTE_GOAL_DETAIL_GET: '/_hr/train/integral/point-detail.json',
	_HR_EMPLOYEE_SCORE_CREDITINTE_INFO_GET: '/_hr/train/integral/ic-staff-info.json',
	_HR_EMPLOYEE_SCORE_CREDITINTE_DETAIL_EDIT_POST: '/_hr/train/integral/edit-record.json',
	_HR_EMPLOYEE_SCORE_CREDITINTE_DETAIL_DEL_POST: '/_hr/train/integral/del-record.json',
	_HR_EMPLOYEE_SCORE_CREDITINTE_ADD_TYPE_GET: '/_hr/train/integral/get-types-by-month.json',
	_HR_EMPLOYEE_SCORE_CREDITINTE_ADD_POST: '/_hr/train/integral/add-record.json',
	_HR_EMPLOYEE_SCORE_INTEGRATION_AUDIT_DETAIL_GET: '/_hr/train/integral/integral-apply-detail.json', // 积分审核详情
	_HR_EMPLOYEE_SCORE_INTEGRATION_GRADE_POST: '/_hr/train/integral/integral-audit.json',

	_HR_EMPLOYEE_SCORE_INTEGRATION_AMOUNT_HISTORY_POST: '/_sc/sale/stage/return-amount-history.json',

	_HR_EMPLOYEE_SCORE_INTEGRATION_REJECT_POST: '/_hr/train/integral/integral-reject.json',
	_HR_EMPLOYEE_SCORE_INTEGRATION_EDIT_POST: '/_hr/train/integral/update-integral-audit.json',
	_HR_EMPLOYEE_SCORE_INTEGRATION_APPLY_INFO_POST: '/_hr/train/integral/get-integral-apply-info.json',
	_HR_EMPLOYEE_SCORE_INTEGRATION_LOOK_EDIT_POST: '/_hr/train/integral/integral-apply-audit.json',
	_HR_EMPLOYEE_SCORE_INTEGRATION_RECORD_GET: '/_sc/sale/train/get-service-record.json', // 获取积分凭证备注
	_HR_EMPLOYEE_SCORE_INTEGRATION_RECORD_ADD_POST: '/_sc/center/quality/add-complaint.json',
	_HR_EMPLOYEE_SCORE_INTEGRATION_RECORD_EDIT_POST: '/_sc/center/quality/edit-complaint.json',
	_HR_EMPLOYEE_SCORE_INTEGRATION_TAPE_GET: '/_cms/library/library-material-tape/get-tape-detail.json',
	_HR_EMPLOYEE_SCORE_INTEGRATION_AUDIT_GET: '/_train/train/exam-audit/course-exam-audit-detail.json',
	_HR_EMPLOYEE_SCORE_INTEGRATION_MAIN_POST: '/_hr/train/integral/import-ic-points.json',
	HR_EMPLOYEE_MENTOR_SELECT_GET: '',
	HR_EMPLOYEE_MENTOR_SELECT_LIST_GET: '/_hr/human/master-evaluate/index.json',
	_HR_EMPLOYEE_MENTOR_SELECT_SAVE_RULE_POST: '/_hr/human/master-evaluate/audit-rule.json',

	HR_EMPLOYEE_MENTOR_RELATION_GET: '',
	HR_EMPLOYEE_MENTOR_RELATION_LIST_GET: '/_hr/human/master-apprentice/index.json',
	_HR_EMPLOYEE_MENTOR_RELATION_IS_EMPTY_GET: '/_hr/human/master-evaluate/index-check.json',
	HR_EMPLOYEE_MENTOR_RULE_GET: '',
	HR_ARCHIVES_ACHIE_RANK_GET: '',
	HR_ARCHIVES_ACHIE_RANK_LIST_GET: '/_hr/human/performance-rank/get-performance-rank.json',
	HR_ARCHIVES_ACHIE_PK_GET: '',
	HR_ARCHIVES_ACHIE_TREND_GET: '',
	HR_EMPLOYEE_DATA_COMMISSAR_GET: '',
	HR_ARCHIVES_AUDIT_LIST_GET: '/_sale/sale/report/audit-record-list.json', // 政工部业务审核
	_HR_ARCHIVES_AUDIT_AUDIT_POST: '/_sale/sale/report/audit.json', // 政工部业务审核操作
	_HR_ARCHIVES_AUDIT_DETAIL_GET: '/_sale/sale/report/detail.json', // 政工部业务审核详情
	HR_EMPLOYEE_DATA_STAFF_SERVICE_GET: '/_sc/sale/sale/staff-service.json',


	// 系统设置
	HR_SYSTEM_ORGANIZATION_GET: '',
	HR_SYSTEM_POSITION_GET: '',
	HR_SYSTEM_ASSESS_GET: '',
	HR_SYSTEM_ROLE_GET: '',
	HR_SYSTEM_ASSESS_RANK_GET: '',
	HR_SYSTEM_ASSESS_UP_GET: '/_hr/human/pro-deploy/index.json',
	_HR_SYSTEM_ASSESS_RELATION_GET: '/_hr/human/pro-system/index.json',
	HR_SYSTEM_ASSESS_INTEGRATION_GET: '',
	_HR_SYSTEM_ASSESS_CREDITINTE_GET: '/_hr/train/integral/system-list.json',
	_HR_SYSTEM_ASSESS_CREDITINTE_DEL_POST: '/_hr/train/integral/del-system.json',
	_HR_SYSTEM_ASSESS_CREDITINTE_EDIT_INFO_GET: '/_hr/train/integral/edit-info.json',
	HR_SYSTEM_ASSESS_STATISTICS_GET: '',
	_HR_SYSTEM_ASSESS_TEAM_RATE_GET: '/_hr/human/staff-information/get-rate-case-name-list-by-default-array.json',
	_HR_SYSTEM_ASSESS_DPR_POST: '/_hr/human/pro-deploy/deploy-pos-role.json',
	_HR_SYSTEM_ASSESS_PROSYSTEM_ADD_POST: '/_hr/human/pro-system/add.json',
	_HR_SYSTEM_ASSESS_DPR_DELETE_POST: '/_hr/human/pro-deploy/delete-pos-role.json',
	_HR_SYSTEM_PROSYSTEM_DEL_POST: '/_hr/human/pro-system/delete.json',
	_HR_SYSTEM_ASSESS_CREDITINTE_SYSTEM_SAVE_POST: '/_hr/train/integral/save-system.json',
	_HR_SYSTEM_ASSESS_CREDITINTE_RULES_SAVE_POST: '/_hr/train/integral/save-rules.json',
	_HR_SYSTEM_ASSESS_CREDITINTE_RULES_DEL_POST: '/_hr/train/integral/del-rule.json',
	_HR_SYSTEM_ASSESS_CREDITINTE_RELATE_LIST_GET: '/_hr/train/integral/relate-select.json',
	_HR_SYSTEM_ASSESS_CREDITINTE_RELATE_SET_POST: '/_hr/train/integral/set-relate.json',
	_HR_SYSTEM_ASSESS_CREDITINTE_RELATE_REMOVE_GET: '/_hr/train/integral/remove-relate.json',
	_HR_SYSTEM_RANK_MARIERIAL_TYPE_GET: '/_cms/library/library-material/material-use.json',
	_HR_SYSTEM_RANK_SYSTEM_NAME_GET: '/_hr/human/rank/system-name-select.json',
	_HR_SYSTEM_RANK_SELECT_GET: '/_hr/human/rank/rank-select.json',
	_HR_SYSTEM_ASSESS_CREDITINTE_RESET_POST: '/_hr/train/integral/reset-rules.json',
	// HR_SYSTEM_ASSESS_STATISTICS_LIST_GET: '/list',



	/**
	 * hr 三立学府 培训中心
	 */

	HR_ACADEMY_TRAIN_DETAIL_VOTE_0_MANAGE_LIST_GET: '/_train/train/vote/list.json', // 获取投票列表
	_HR_ACADEMY_TRAIN_DETAIL_VOTE_1_ADD_VOTE_POST: '/_train/train/vote/save.json', // 新建投票
	_HR_ACADEMY_TRAIN_DETAIL_VOTE_1_EDIT_VOTE_POST: '/_train/train/vote/update.json', // 编辑投票\
	_HR_ACADEMY_TRAIN_DETAIL_VOTE_2_VOTE_DETAIL_GET: '/_train/train/vote/detail.json',
	_HR_ACADEMY_TRAIN_DETAIL_VOTE_1_DELETE_VOTE_POST: '/_train/train/vote/update.json', // 编辑投票
	_HR_ACADEMY_TRAIN_DETAIL_VOTE_2_PROVIDE_POST: '/_train/train/vote/send.json', // 发放投票
	_HR_ACADEMY_TRAIN_DETAIL_VOTE_2_RESULT_GET: '/_train/train/vote/result.json', // 投票结果
	_HR_ACADEMY_TRAIN_DETAIL_VOTE_2_VOTE_DELETE_GET: '/_train/train/vote/delete.json', // 删除投票
	_HR_ACADEMY_TRAIN_DETAIL_VOTE_2_VOTE_PARTICIPATE_GET: '/_train/train/vote/result-participator.json', // 获取投票参与人
	HR_ACADEMY_TRAIN_DETAIL_ENROLL_0_MANAGE_LIST_GET: '/_train/train/apply/list.json', // 链接报名列表
	_HR_ACADEMY_TRAIN_DETAIL_ENROLL_1_ADD_VOTE_POST: '/_train/train/apply/save.json', // 新建报名
	_HR_ACADEMY_TRAIN_DETAIL_ENROLL_2_EDIT_VOTE_POST: '/_train/train/apply/update.json', // 编辑报名
	_HR_ACADEMY_TRAIN_DETAIL_ENROLL_2_ENROLL_DETAIL_GET: '/_train/train/apply/detail.json', // 报名详情
	_HR_ACADEMY_TRAIN_DETAIL_ENROLL_0_ENROLL_DELETE_POST: '/_train/train/apply/delete.json', // 删除报名
	_HR_ACADEMY_TRAIN_DETAIL_ENROLL_2_ENROLL_PROVIDE_POST: '/_train/train/apply/send.json', // 发放报名
	HR_ACADEMY_TRAIN_DETAIL_ENROLL_2_RESULT_LIST_GET: '/_train/train/apply-record/result.json', // 报名结果
	_HR_ACADEMY_TRAIN_DETAIL_ENROLL_2_RESULT_AUDIT_GET: '/_train/train/apply-record/detail.json', // 审核详情
	_HR_ACADEMY_TRAIN_DETAIL_ENROLL_2_RESULT_AUDIT_POST: '/_train/train/apply-record/audit.json', // 报名审核
	HR_ACADEMY_TRAIN_DETAIL_DRAW_0_MANAGE_LIST_GET: '/_train/train/lottery/list.json', // 抽奖列表
	_HR_ACADEMY_TRAIN_DETAIL_ENROLL_0_DRAW_DELETE_POST: '/_train/train/lottery/delete.json', // 删除抽奖
	_HR_ACADEMY_TRAIN_DETAIL_ENROLL_0_DRAW_ADD_POST: '/_train/train/lottery/save.json', // 新建抽奖
	_HR_ACADEMY_TRAIN_DETAIL_ENROLL_0_DRAW_EDIT_POST: '/_train/train/lottery/update.json', // 编辑抽奖
	_HR_ACADEMY_TRAIN_DETAIL_ENROLL_0_DRAW_DETAIL_GET: '/_train/train/lottery/detail.json', // 抽奖详情
	_HR_ACADEMY_TRAIN_DETAIL_ENROLL_0_DRAW_SEND_GET: '/_train/train/lottery/send.json', // 发放抽奖
	_HR_ACADEMY_TRAIN_DRAW_INFO_GET: '/_train/train/lottery-projection/info.json', // 抽奖基本信息
	_HR_ACADEMY_TRAIN_DRAW_PARTICIPATOR_GET: '/_train/train/lottery-projection/participator.json', // 获取抽奖参与人员
	_HR_ACADEMY_TRAIN_DRAW_NOW_DRAW_GET: '/_train/train/lottery-projection/lottery.json', // 获取某次抽奖结果
	_HR_ACADEMY_TRAIN_DRAW_RESULT_GET: '/_train/train/lottery-projection/result.json', // 查看抽奖结果
	_HR_ACADEMY_TRAIN_DRAW_RESULT_DELETE_GET: '/_train/train/lottery-projection/delete.json', // 删除抽奖结果
	_HR_ACADEMY_TRAIN_DETAIL_DRAW_1_RESULT_HEADER_GET: '/_train/train/lottery/result.json', // 抽奖结果顶部信息
	HR_ACADEMY_TRAIN_DETAIL_DRAW_1_RESULT_LIST_GET: '/_train/train/lottery/result-record.json', // 抽奖结果列表
	_HR_ACADEMY_TRAIN_DETAIL_DRAW_1_RESULT_STATUS_POST: '/_train/train/lottery/audit.json', // 抽奖状态修改

	HR_SYSTEM_ASSESS_STATISTICS_LIST_GET: '/_hr/train/recommend-conf/list.json', // 互荐表列表
	HR_SYSTEM_ASSESS_STATISTICS_MAIN_LIST_GET: '/_hr/train/data-conf/list.json', // 数据配置列表
	HR_SYSTEM_ASSESS_STATISTICS_DEL_POST: '/_hr/train/recommend-conf/del.json',
	_HR_SYSTEM_ASSESS_STATISTICS_CHECK_POST: '/_hr/train/data-conf/check-data-conf.json',
	_HR_SYSTEM_ASSESS_STATISTICS_ADD_POST: '/_hr/train/recommend-conf/add.json',
	_HR_SYSTEM_ASSESS_STATISTICS_DETAIL_GET: '/_hr/train/recommend-conf/detail.json',
	_HR_DEPART_TWO_LEVEL_DEPART_GET: '/_hr/human/depart/get-two-level-depart.json',
	_HR_TRAIN_DATA_CONF_DETAIL_GET: '/_hr/train/data-conf/detail.json',
	HR_TRAIN_DATA_CONF_ADD_POST: '/_hr/train/data-conf/add.json',
	HR_SYSTEM_ASSESS_UP_ADD_GET: '',
	HR_SYSTEM_ASSESS_INTEGRATION_ADD_GET: '',
	HR_SYSTEM_ASSESS_INTEGRATION_RULES_GET: '',
	HR_TRAIN_SCHEDULE_GET: '/_train/train/schedule/month-schedule.json',
	HR_TRAIN_SCHEDULE_NOTE_GET: '/_train/train/schedule/day-schedule.json',
	HR_TRAIN_SCHEDULE_EMPTY_GET: '/_train/train/schedule/clear-day-schedule.json',
	HR_ACADEMY_TRANSFER_TEACHER_DETAIL_GET: '',
	_HR_ACADEMY_TRAIN_SCHEDULE_AUDIT_DETAIL_GET: '/_train/train/apply-record/detail.json',
	_HR_ACADEMY_TRAIN_SCHEDULE_AUDIT_POST: '/_train/train/apply-record/audit.json', // 课程报名审核
	_HR_ACADEMY_TRAIN_SCHEDULE_CLASS_CHANGE_POST: '/_train/train/participator/change-study-type.json', // 课程报名课程状态变更
	_HR_TRAIN_PROJECT_SAVE_POST: '/_train/train/project/save.json', // 课程添加第一步第二步
	_HR_TRAIN_PROJECT_EDIT_SAVE_POST: '/_train/train/project/update.json', // 编辑项目
	_HR_TRAIN_PROJECT_DETAIL_GET: '/_train/train/project-course/info.json', // 课程详情
	_HR_TRAIN_COURSE_LIST_GET: '/_train/train/project-course/course-list.json', // 课程列表
	_HR_TRAIN_COURSE_SELECT_GET: '/_train/train/course/info.json', // 课程库详情

	_HR_TRAIN_PROJECT_COURSE_ADD_SAVE_POST: '/_train/train/project-course/save.json', // 新建课程
	_HR_TRAIN_PROJECT_COURSE_EDIT_SAVE_POST: '/_train/train/project-course/update.json', // 编辑课程
	_HR_TRAIN_PROJECT_COURSE_DELETE_POST: '/_train/train/project-course/delete.json', // 删除课程
	_HR_TRAIN_RANDOM_GOURP_GET: '/_train/train/group/random-group.json', // 随机分组
	_HR_TRAIN_HAND_GOURP_GET: '/_train/train/group/get-participator.json', // 手动分组
	_HR_TRAIN_PLAN_LIST_GET: '/_train/train/activity/activity-list.json', // 活动计划
	_HR_ACADEMY_TRAIN_DETAIL_PARTICIPATE_TABS_GET: '/_train/train/participator/project-course-list.json', // 参与人 tabs
	HR_ACADEMY_TRAIN_DETAIL_PARTICIPATE_0_ROSTER_LIST_GET: '/_train/train/participator/participator-list.json', // 参与人列表
	_HR_ACADEMY_TRAIN_DETAIL_PARTICIPATE_DELETE_POST: '/_train/train/participator/delete-participator.json',
	_HR_ACADEMY_TRAIN_DETAIL_SIGN_ADD_POST: '/_train/train/sign/save.json', // 新建签到
	_HR_ACADEMY_TRAIN_DETAIL_SIGN_EDIT_POST: '/_train/train/sign/update.json', // 编辑签到
	_HR_ACADEMY_TRAIN_DETAIL_SIGN_SEND_DETAIL_GET: '/_train/train/sign/send-detail.json', // 发放签到详情
	HR_ACADEMY_TRAIN_DETAIL_SIGN_0_MANAGE_LIST_GET: '/_train/train/sign/list.json', // 签到列表
	_HR_ACADEMY_TRAIN_DETAIL_SIGN_SEND_POST: '/_train/train/sign/send.json', // 发放签到
	_HR_ACADEMY_TRAIN_DETAIL_SIGN_DELETE_POST: '/_train/train/sign/delete.json', // 删除签到
	_HR_ACADEMY_TRAIN_DETAIL_SIGN_CHANGE_POST: '/_train/train/sign/change-status.json', // 开启关闭签到
	_HR_ACADEMY_TRAIN_DETAIL_SIGN_TIME_RANGE_GET: '/_train/train/sign/get-course-time.json', // 签到整体时间段
	_HR_ACADEMY_TRAIN_DETAIL_SIGN_RESULT_GET: '/_train/train/sign/result.json', // 统计出勤情况
	_HR_ACADEMY_TRAIN_DETAIL_SIGN_RESULT_RECORD_GET: '/_train/train/sign/result-record.json', // 管理出勤情况
	_HR_ACADEMY_TRAIN_DETAIL_SIGN_RESULT_RECORD_CHANGE_POST: '/_train/train/sign/result-record-change.json', // 修改出勤情况
	HR_ACADEMY_TRAIN_DETAIL_PAPER_0_PASS_LIST_GET: '/_train/train/exam-paper/paper-list.json', // 通关试卷列表
	_HR_ACADEMY_TRAIN_DETAIL_PAPER_DELETE_POST: '/_train/train/exam-paper/delete.json', // 通关试卷删除
	HR_ACADEMY_TRAIN_DETAIL_PAPER_0_AUDIT_LIST_GET: '/_train/train/exam-audit/audit-list.json', // 审核考试列表
	_HR_ACADEMY_TRAIN_DETAIL_PAPER_0_AUDIT_INFO_GET: '/_train/train/exam-audit/audit-info.json', // 审核考试凭证详情
	_HR_ACADEMY_TRAIN_DETAIL_PAPER_AUDIT_INFO_GET: '/_train/train/exam-audit/exam-info.json', // 审核考试配置详情
	HR_ACADEMY_TRAIN_DETAIL_EXAM_0_PASS_LIST_GET: '/_train/train/exam-paper/paper-list.json', // 通关试卷列表
	_HR_ACADEMY_TRAIN_DETAIL_EXAM_AUDIT_ADD_POST: '/_train/train/exam-audit/save.json', // 开通审核考试
	_HR_ACADEMY_TRAIN_DETAIL_EXAM_AUDIT_EDIT_POST: '/_train/train/exam-audit/update.json', // 编辑审核考试
	HR_ACADEMY_TRAIN_DETAIL_EXAM_0_AUDIT_LIST_GET: '/_train/train/exam-audit/audit-list.json', // 审核考试列表
	_HR_ACADEMY_TRAIN_DETAIL_EXAM_PAPER_SAVE_POST: '/_train/train/exam-paper/save.json', // 新建通关考试
	_HR_ACADEMY_TRAIN_DETAIL_EXAM_PAPER_UPDATE_POST: '/_train/train/exam-paper/update.json', // 修改通关考试
	_HR_ACADEMY_TRAIN_DETAIL_EXAM_QUESTION_ID_POST: '/_train/train/library-question/question-by-ids.json', // 通过 id 获取试题
	_HR_ACADEMY_TRAIN_PROJECT_COURSE_SEARCH_GET: '/_train/train/project-course/search-course.json', // 课程搜索下拉
	HR_ACADEMY_TRAIN_DETAIL_EXAM_3_STORE_LIST_GET: '/_train/train/library-question/question-list.json', // 课程库3列表
	HR_ACADEMY_TRAIN_DETAIL_EXAM_5_STORE_LIST_GET: '/_train/train/library-question/question-list.json', // 课程库5列表
	HR_ACADEMY_TRAIN_DETAIL_EXAM_4_SELECT_LIST_GET: '/_train/train/library-paper/paper-list.json', // 试卷库列表
	_HR_ACADEMY_TRAIN_DETAIL_PAPER_ARRANGE_POST: '/_train/train/exam-paper/arrange-paper.json', // 培训安排 - 项目详情 - 安排考试
	_HR_ACADEMY_TRAIN_DETAIL_PAPER_ARRANGE_DETAIL_GET: '/_train/train/exam-paper/detail.json', // 培训安排 - 项目详情 - 安排考试
	_HR_ACADEMY_TRAIN_DETAIL_PAPER_RESULT_HEADER_GET: '/_train/train/exam-result/detail.json', // 考试结果—头部数据
	_HR_ACADEMY_TARAIN_DETAIL_PAPER_REAULT_NEXT_LIST_GET: '/_train/train/exam-result/next-list.json', // 培训安排-通关试卷-考试结-上一个下一个
	_HR_ACADEMY_TRAIN_DETAIL_PAPER_RESULT_TABS_GET: '/_train/train/exam-paper/exam-result-total.json', // 考试结果—头部统计数据
	HR_ACADEMY_TRAIN_DETAIL_PAPER_3_RESULT_LIST_GET: '/_train/train/exam-result/list.json', // 考试列表数据
	_HR_ACADEMY_TRAIN_EXAM_RESULT_EXPORT_GET: '/_train/train/exam-result/export.json', // 考试成绩单 - 导出
	_HR_ACADEMY_TRAIN_COURSE_ID_NAME_POST: '/_train/train/project-course/search-course.json', // 模糊搜索课程
	_HR_ACADEMY_TRAIN_DETAIL_PAPER_ANSWER_GET: '/_train/h5/exam/answer-info.json', // 答题-答题详情  ----弃用
	_HR_ACADEMY_TRAIN_DETAIL_PAPER_ANSWER_NEW_GET: '/_train/train/exam-result/answer-detail.json', // 答题-答题详情 ---新
	_HR_ACADEMY_TRAIN_DETAIL_READ_PAPER_GET: '/_train/train/exam-paper/read-paper.json', // 培训安排 - 通关考试 - 人工阅卷
	_HR_ACADEMY_TRAIN_PARTICIPATOR_ADD_POST: '/_train/train/participator/add-participator.json', // 添加参与人员
	_HR_ACADEMY_TRAIN_PARTICIPATOR_EXPORT_GET: '/_train/train/participator/export.json', // 添加人员导出
	_HR_ACADEMY_TRAIN_PAPER_DETAIL_GET: '/_train/train/exam-paper/info.json', // 通关试卷详情
	_HR_ACADEMY_TRAIN_PROJECT_COURSE_ID_GET: '/_train/train/project-course/code-exist.json', // 课程编码重复判断
	_HR_ACADEMY_TRAIN_PROJECT_COURSE_STORE_ID_GET: '/_train/train/course/get-course-id-name.json', // 搜索课程库课程
	_HR_ACADEMY_TRAIN_PAPER_NAME_VERIFY_GET: '/_train/train/library-paper/verify-paper-name.json', // 验证试卷名是否重复
	_HR_ACADEMY_TRAIN_EXAM_RESULT_DELETE_POST: '/_train/train/exam-result/delete.json', // 清空考试信息
	_HR_ACADEMY_TRAIN_SIGN_RESULT_EXPORT_GET: '/_train/train/sign/export.json', // 签到结果导出
	_HR_ACADEMY_TRAIN_QR_CODE_DOWNLOAD_GET: '/_train/train/qr-code/download.json',

	// 三立学府 统计中心
	HR_ACADEMY_STATISTIC_STUDY_LIST_GET: '/_train/train/staff-study/list.json', // 学员学习记录列表
	_HR_ACADEMY_STATISTIC_STUDY_DETAIL_GET: '/_train/train/staff-study/detail.json', // 学员学习记录详情
	_HR_ACADEMY_STATISTIC_STUDY_DETAIL_TRAIN_GET: '/_train/train/staff-study/pre-train.json', // 岗前培训详情
	_HR_ACADEMY_STATISTIC_STUDY_DETAIL_PROJECT_GET: '/_train/train/staff-study/talent-echelon.json', // 人才计划详情
	_HR_ACADEMY_STATISTIC_STUDY_DETAIL_ITEM_GET: '/_train/train/staff-study/other-project.json', // 其他项目详情
	_HR_ACADEMY_STATISTIC_STUDY_DETAIL_SELF_STUDY_GET: '/_train/train/staff-study/self-study.json', // 自学详情列表
	HR_ACADEMY_STATISTIC_COURSE_LIST_GET: '/_train/train/course-record/list.json', // 培训课程记录
	_HR_ACADEMY_STATISTIC_COURSE_LIST_EXPORT_GET: '/_train/train/course-record/export.json', // 培训课程记录 导出
	HR_ACADEMY_STATISTIC_STUDY_DETAIL_LIST_GET: '/_train/train/staff-study/echelon-course-list.json', // 统计中心按计划查看列表
	_HR_TRAIN_ECHELON_SHOW_ECHELON_FIRST_LIST_GET: '/_train/train/echelon/echelon-plan.json', // 人才梯队第一步结构
	_HR_ACADEMY_STATISTIC_STUDY_DELETE_POST: '/_train/train/course-record/delete.json', // 彻底删除
	_HR_ACADEMY_STATISTIC_STUDY_RECOVERY_POST: '/_train/train/course-record/recovery.json', // 恢复


	/**
	课程中心
	*/
	// 课程库
	HR_ACADEMY_COURSE_STORE_LIST_GET: "/_train/train/course/list.json",
	_HR_ACADEMY_COURSE_STORE_DELETE_POST: '/_train/train/course/delete.json', // 删除课程
	_HR_ACADEMY_COURSE_STORE_INFO_GET: "/_train/train/course/detail.json", // 课程详情
	_HR_ACADEMY_COURSE_SAVE_POST: "/_train/train/course/save.json", // 新建课程
	_HR_ACADEMY_COURSE_UPDATE_POST: "/_train/train/course/update.json", // 编辑课程
	_HR_ACADEMY_COURSE_NAME_EXIST: "/_train/train/course/name-exist.json", // 课程哭验证课程名称重复
	_HR_ACADEMY_COURSE_CODE_EXIST: "/_train/train/course/code-exist.json", // 课程哭验证课程名称重复
	_HR_ACADEMY_COURSE_STORE_EXPORT_GET: "/_train/train/course/export.json", // 课程库导出




	// 题库
	HR_ACADEMY_COURSE_QUESTION_LIST_GET: '/_train/train/library-question/list.json', // 题库列表
	_HR_TRAIN_LIBRARY_QUESTION_SAVE_POST: "/_train/train/library-question/save.json", // 保存题目
	_HR_TRAIN_LIBRARY_QUESTION_UPDATE_POST: "/_train/train/library-question/update.json", // 编辑题目
	_HR_TRAIN_LIBRARY_QUESTION_DELETE_POST: "/_train/train/question-audit/delete.json", // 删除题目
	_HR_TRAIN_LIBRARY_QUESTION_INFO_GET: '/_train/train/library-question/detail.json', // 题目详情
	_HR_ACADEMY_COURSE_QUESTION_SETSCORE_POST: "/_train/train/question-audit/score.json", //  设置分值
	_HR_ACADEMY_COURSE_UPDATE_COURSE_TYPE_POST: "/_train/train/course/change-course-type.json", // 修改课程类型
	_HR_ACADEMY_COURSE_QUESTION_EXPORT_GET: "/_train/train/library-question/export.json", // 题库导出
	_HR_ACADEMY_COURSE_QUESTION_IMPORT_POST: "/_train/train/library-question/import.json", // 题库导入


	// 试卷库
	HR_ACADEMY_COURSE_PAPER_LIST_GET: '/_train/train/library-paper/list.json', // 试卷库列表
	_HR_TRAIN_LIBRARY_PAPER_INFO_GET: "/_train/train/library-paper/detail.json", // 试卷详情
	_HR_TRAIN_LIBRARY_PAPER_SAVE_POST: "/_train/train/library-paper/save.json", // 保存试卷
	_HR_TRAIN_LIBRARY_PAPER_UPDATE_POST: "/_train/train/library-paper/update.json", // 保存试卷
	_HR_ACADEMY_COURSE_PAPER_DELETE_POST: "/_train/train/library-paper/delete.json", // 删除试卷
	_HR_TRAIN_LIBRARY_PAPER_VALID_NAME_GET: "/_train/train/library-paper/verify-paper-name.json", // 验证试卷名称是否重复
	_HR_ACADEMY_COURSE_PAPER_IMPORT_POST: "/_train/train/library-paper/import.json", // 题库导入

	// 编辑试卷
	HR_ACADEMY_COURSE_PAPER_EDIT_LIST_GET: "/_train/train/library-paper-question/list.json", // 编辑试卷时获取试卷题目列表
	_HR_ACADEMY_COURSE_PAPER_QUESTION_SCORE_POST: "/_train/train/library-paper-question/score.json", // 设置某张试卷的题目的分值
	_HR_ACADEMY_COURSE_PAPER_QUESTION_DETAIL_GET: "/_train/train/library-paper-question/detail.json", // 获试卷下的题目详情
	_HR_ACADEMY_COURSE_PAPER_QUESTION_UPDATE_POST: "/_train/train/library-paper-question/update.json", // 编辑试卷下的题目
	_HR_ACADEMY_COURSE_PAPER_QUESTION_DELETE_POST: "/_train/train/library-paper-question/delete.json", // 试卷下的删除题目
	_HR_ACADEMY_COURSE_PAPER_QUESTION_ADD_POST: "/_train/train/library-paper/add-question.json", // 试卷下的添加题目

	// 题目审核
	HR_ACADEMY_COURSE_QUESTION_AUDIT_LIST_GET: "/_train/train/question-audit/list.json", // 题目审核列表
	_HR_ACADEMY_COURSE_QUESTION_ADD_TO_LIBRARY_POST: "/_train/train/question-audit/add-library.json", // 题目审核-添加到题库
	_HR_ACADEMY_COURSE_LIBRARY_QUESTION_AUDIT_POST: "/_train/train/question-audit/audit.json", //  题目批量审核
	_HR_ACADEMY_COURSE_QUESTION_AUDIT_INFO_GET: "/_train/train/question-audit/detail.json", // 题目审核-题目详情（审核详情）
	_HR_ACADEMY_COURSE_QUESTION_AUDIT_RELA_SUB_POST: "/_train/train/question-audit/relation-subject.json",
	// 选题
	HR_ACADEMY_COURSE_QUESTION_SELECT_LIST_GET: "/_train/train/library-question/list.json", // 调题库列表接口，需要新的mutation

	// 公用
	_HR_TRAIN_ECHELON_SHOW_ECHELON_LIST_GET: "/_train/train/echelon/show-echelon-list.json", // 课题树结构
	_HR_ACADEMY_COURSE_QUESTION_RELATION_SUBJECT_POST: "/_train/train/library-question/relation-subject.json", // 关联课题
	_HR_HUMAN_DEPART_DEPART_STAFF: "/_hr/human/depart/depart-staff.json", // 所有部门员工
	_HR_ACADEMY_COURSE_MATERIAL_TYPE_GET: "/_cms/library/library-material/material-type.json", //  素材类型
	_HR_ACADEMY_COURSE_MATERIAL_CATEGORY_GET: "/_cms/library/library-category/all.json", //  素材类目树,不受权限控制，不需要顶级
	_HR_ACADEMY_COURSE_TABLE_TITLE_SAVE_POST: "/_train/train/individual-list/save.json", // 自定义表头
	_HR_ACADEMY_COURSE_TABLE_TITLE_GET: "/_train/train/individual-list/info.json", // 获取自定义表头
	_HR_ACADEMY_ECHELON_LIST: '/_train/train/echelon/second-echelon-list.json', // 获取梯队
	_HR_HUMAN_FIRST_DEPART_ID_GET: "/_hr/api/human/get-first-depart-id.json", // 获取一级部门id

	/*
	 * hr 档案管理
	 */
	// 员工客户
	// 获取业务跟踪-列表表头设置
	_HR_ARCHIVES_EMPLOYEE_BUSINESS_CONFIG_GET: '/_sale/sale/business-data-manage/table-config.json',
	// 保存表头设置
	_HR_ARCHIVES_EMPLOYEE_BUSINESS_CONFIG_SAVE_POST: '/_sale/sale/business-data-manage/save-table-config.json',
	// 获取业务跟踪查看数据详情-列表保存表头设置
	_HR_ARCHIVES_EMPLOYEE_DETAIL_CONFIG_GET: '/_sale/sale/business-data-manage/info-table-config.json',
	// 是否可添加数据接口
	HR_ARCHIVES_EMPLOYEE_CONFIG_GET: '/_sale/sale/business-data-manage/get-config.json',
	// 公司名联想
	_HR_ARCHIVES_EMPLOYEE_COMPANY_NAME_GET: '/_sale/sale/business-data-manage/associate.json',
	// 编辑、添加数据
	_HR_ARCHIVES_EMPLOYEE_DATA_EDIT_POST: '/_sale/sale/business-data-manage/save.json',
	// 删除数据
	_HR_ARCHIVES_EMPLOYEE_DATA_DELETE_POST: '/_sale/sale/business-data-manage/daily-data-del.json',
	// 获取数据详情
	_HR_ARCHIVES_EMPLOYEE_DATA_DETAIL_GET: '/_sale/sale/business-data-manage/daily-data-info.json',

	HR_ARCHIVES_EMPLOYEE_BUSINESS_LIST_GET: '/_sale/sale/business-data-manage/data-list.json',
	HR_ARCHIVES_EMPLOYEE_BUSINESS_SUMMARY_GET: '/_sale/sale/business-data-manage/data-summary.json',
	HR_ARCHIVES_EMPLOYEE_BUSINESS_DETAIL_LIST_GET: '/_sale/sale/business-data-manage/data-summary-list.json',
	HR_ARCHIVES_EMPLOYEE_BUSINESS_WATCH_LIST_GET: '/_sale/sale/business-data-manage/daily-data-list.json',

	HR_ARCHIVES_EMPLOYEE_CUSTOMER_LIST_GET: '/_sale/sale/deal-customer/list-for-commissar.json',
	// 导出列表
	HR_ARCHIVES_EMPLOYEE_OUTPUT_LIST_GET: '/_sale/sale/deal-customer/list-for-commissar-export-list.json',
	// 建立异步导出任务
	HR_ARCHIVES_EMPLOYEE_OUTPUT_DOWNLOAD_POST: '/_sale/sale/deal-customer/list-for-commissar-export.json',
	_HR_ARCHIVES_EMPLOYEE_PERSON_DERPART_LIST_GET: '/_hr/human/pro-info/alert-depart-list.json',
	HR_ARCHIVES_EMPLOYEE_CUSTOMER_DETAIL_POST: '/_sc/sale/train/get-service-stage.json',
	HR_ARCHIVES_EMPLOYEE_SERVICE_DETAIL_GET: '/_sc/sale/train/get-service-record-item.json',
	// 目标跟进
	HR_ARCHIVES_EMPLOYEE_TARGET_LIST_POST: '/_sale/sale/target-follow-up/list.json',
	// 季度配置
	HR_ARCHIVES_EMPLOYEE_TARGET_CONFIG_GET: '/_sale/sale/target-config/set-config.json',
	// 是否显示编辑按钮
	HR_ARCHIVES_EMPLOYEE_TARGET_SHOW_EDIT_GET: '/_sale/sale/target-follow-up/show-edit-btn.json',
	// 编辑目标
	HR_ARCHIVES_EMPLOYEE_TARGET_EDIT_POST: '/_sale/sale/target-follow-up/create-and-edit.json',
	// 获取季度半年度时间
	HR_ARCHIVES_EMPLOYEE_TARGET_TIME_GET: '/_sale/sale/target/save-type.json',

	HR_ARCHIVES_PERSON_GET: '',
	HR_ARCHIVES_PERSON_LIST_GET: '/_hr/file/staff-file/list.json',
	_HR_ARCHIVES_PERSON_DETAIL_PERSON_HEADER_GET: '/_hr/file/staff-file/staff-base-info.json', // 个人信息头像模块
	_HR_ARCHIVES_PERSON_DETAIL_PERSON_PERSON_GET: '/_hr/file/staff-file/staff-info.json',
	_HR_ARCHIVES_PERSON_DETAIL_PERSON_ADD_FOLLOW_POST: '/_hr/file/staff-file/add-follow-info.json',
	_HR_ARCHIVES_PERSON_DETAIL_PERSON_OTHER_RECOMMEND_LIST_GET: '/_hr/file/staff-file/recommend-info-list.json', // 个人资料 共用头部
	HR_ARCHIVES_PERSON_DETAIL_PERSON_OTHER_RECOMMEND_LIST_GET: '/_hr/file/staff-file/recommend-info-list.json', // 个人资料 共用头部
	_HR_ARCHIVES_PERSON_DETAIL_PERSON_OTHER_FOLLOW_LIST_GET: '/_hr/file/staff-file/follow-info-list.json', // 个人资料 共用头部
	_HR_ARCHIVES_PERSON_DETAIL_PERSON_STAFF_INFO_LIST_GET: '/_hr/train/integral/ic-staff-info.json', // 个人资料 共用头部

	_HR_TRAIN_SCHEDULE_GET: '/_train/train/schedule/month-schedule.json', // 课程表每月
	_HR_TRAIN_SCHEDULE_NOTE_POST: '/_train/train/schedule/day-schedule.json', // 课程表每日数据
	_HR_TRAIN_SCHEDULE_EMPTY_POST: '/_train/train/schedule/clear-day-schedule.json', // 清空当天课程
	_HR_TRAIN_SCHEDULE_ONLINE_SAVE_POST: '/_train/train/apply/online-save.json', // 参与课程
	_HR_TRAIN_SCHEDULE_ONLINE_GET_COURSE_CONTENT_GET: '/_train/train/apply/detail-by-course.json', //
	HR_ACADEMY_TRAIN_ARRANGEMENT_LIST_GET: '/_train/train/project/project-list.json', // 培训计划列表
	_HR_ACADEMY_TRAIN_ARRANGEMENT_LIST_DELETE_GET: '/_train/train/project/delete-project.json', // 培训计划列表
	HR_ACADEMY_TRAIN_ARRANGEMENT_AUDIT_LIST_GET: '/_train/train/exam-audit/audit-list.json', // 考试审核
	_HR_ACADEMY_TRAIN_ARRANGEMENT_AUDIT_DETAIL_GET: '/_train/train/exam-audit/audit-info.json', // 培训安排 - 审核考试-凭证信息
	_HR_ACADEMY_TRAIN_ARRANGEMENT_AUDIT_POST: '/_train/train/exam-audit/audit-save.json', // 培训安排 - 审核考试 - 审核凭证

	/**
	 * hr 精英中心
	 */
	_HR_ACADEMY_ELITE_MANAGE_LIST_GET: '/_train/train/echelon/show-echelon-list.json', // 课题管理-获取树形结构
	_HR_ACADEMY_ELITE_MANAGE_LIST_SAVE_GET: '/_train/train/echelon/save-echelon-list.json', // 课程管理-保存课题（树形结构）
	_HR_ACADEMY_ELITE_ECHELON_LIST_GET: '/_train/train/echelon/get-echelon.json', // 新增/编辑梯队页面内的一级梯队信息
	_HR_ACADEMY_ELITE_ADD_CREATE_POST: '/_train/train/echelon/create-or-edit.json', // 新增/编辑梯队
	_HR_ACADEMY_ELITE_ADD_LIST_GET: '/_train/train/echelon/info.json', // 获取人才计划详情信息
	_HR_ACADEMY_ELITE_TALENT_ECHELON_LIST_GET: '/_train/train/talent-inventory/echelon-list.json', // 人才盘点-获取梯队树形结构
	_HR_ACADEMY_ELITE_TALENT_SETTING_PURPOSE_GET: '/_train/train/depart-info/get-purpose.json', // 获取tab（部门）宗旨
	_HR_ACADEMY_ELITE_TALENT_SETTING_PURPOSE_POST: '/_train/train/depart-info/edit-purpose.json', // 保存部门宗旨
	_HR_ACADEMY_ELITE_TALENT_SETTING_DELETE_SUBJECT_POST: '/_train/train/echelon/del-subject.json', // 课程梯队设置-删除课题
	_HR_ACADEMY_ELITE_TALENT_SETTING_ADD_SUBJECT_POST: '/_train/train/echelon/add-subject.json', // 课程梯队设置-添加课程
	_HR_ACADEMY_ELITE_SETTING_LIST_GET: '',
	_HR_ACADEMY_ELITE_SETTING_ECHELON_LIST_GET: '/_train/train/echelon/echelon-list.json', // 课程梯队设置-人才计划树形结构
	_HR_ACADEMY_ELITE_SETTING_PLAN_DETAIL_GET: '/_train/train/echelon/echelon-info.json', // 课程梯队设置-阶段详情（条件/课程）
	_HR_ACADEMY_ELITE_SETTING_DELETE_PLAN_POST: '/_train/train/echelon/del-echelon.json', // 课程梯队设置-删除人才梯队（计划）
	_HR_ACADEMY_ELITE_SETTING_STAGE_INFO_GET: '/_train/train/talent-inventory/stage-info.json', // 人才盘点-根据阶段ID获取阶段详细信息
	HR_ACADEMY_ELITE_TALENT_LIST_GET: '/_train/train/talent-inventory/staff-list.json', // 人才盘点-员工列表
	_HR_ACADEMY_ELITE_TALENT_DELETE_STAFF_POST: '/_train/train/talent-inventory/del-staff.json', // 人才盘点-员工删除
	_HR_ACADEMY_ELITE_TALENT_CHANGE_ECHELON_POST: '/_train/train/talent-inventory/change-echelon.json', // 人才盘点-变更梯队
	_HR_ACADEMY_ELITE_TALENT_INPUT_DATA_POST: '/_train/train/talent-inventory/import.json', // 人才盘点-导入
	_HR_ACADEMY_ELITE_TALENT_ADD_STAFF_POST: '/_train/train/talent-inventory/add-staff.json', // 人才盘点-添加员工
	_HR_ACADEMY_ELITE_COURSE_DETAIL_GET: '/_train/train/talent-inventory/course-info.json', // 人才盘点-获取课程信息
	_HR_ACADEMY_ELITE_COURSE_LIST_GET: '/_train/train/echelon/get-course-info.json', // 获取课程列表
	_HR_ACADEMY_ELITE_COURSE_INFO_LIST_GET: '/_train/train/talent-inventory/course-info.json', // 人才盘点-获取课程信息
	_HR_ACADEMY_ELITE_ADD_VALIDATE_NAME_GET: '/_train/train/echelon/check-name-repeat.json', // 课题管理-验证计划名称是否重复
	_HR_ACADEMY_ELITE_ADD_VALIDATE_SORT_GET: '/_train/train/echelon/check-sort-repeat.json', // 验证计划排序值是否重复

	/**
	 * hr 社保管理
	 */
	HR_SALARY_SOCIAL_SUBSIDY_GET: '',
	HR_SALARY_SOCIAL_SUBSIDY_LIST_GET: '/_hr/human/social-security/list.json',
	HR_SALARY_SOCIAL_HISTORY_GET: '',
	HR_SALARY_SOCIAL_HISTORY_LIST_GET: '/_hr/human/social-security/historical-data.json',
	_HR_SALARY_SOCIAL_SETTING_GET: '/_hr/human/social-security/conf-detail.json',
	_HR_SALARY_SOCIAL_SETTING_ADD_POST: '/_hr/human/social-security/add-conf.json',
	_HR_ACADEMY_TRAIN_DETAIL_BASIC_0_INFO_LIST_GET: '/_train/train/project/info.json', // 培训计划详情与课程列表
	HR_ACADEMY_TRAIN_SCHEDULE_ADD_LIST_GET: '/_train/train/apply-record/apply-list.json', // 课程报名审核列表
	_HR_SALARY_SOCIAL_SUBSIDY_CONVERSION_POST: '/_hr/human/social-security/batch-conversion.json',
	_HR_SALARY_SOCIAL_SUBSIDY_LIST_ROW_ADJUSTMENT_GET: '/_hr/human/social-security/detail.json', // 单行测弹窗
	_HR_SALARY_SOCIAL_SUBSIDY_LIST_ROW_ADJUSTMENT_ADD_POST: '/_hr/human/social-security/add.json', // 单行测弹窗
	HR_SYSTEM_ASSESS_CREDIT_ADD_GET: '',
	HR_SYSTEM_ASSESS_CREDIT_RULES_GET: '',
	_HR_SALARY_SOCIAL_SUBSIDY_DEFAULT_CONF_GET: '/_hr/human/social-security/get-default-conf.json',
	_HR_ARCHIVES_PERSON_DETAIL_PERSON_RECOMMEND_CONF_GET: '/_hr/file/staff-file/recommend-info.json', // 个人资料 共用头部
	_HR_SALARY_SOCIAL_SUBSIDY_IMPORRT_SAVE_POST: '/_hr/human/social-security/import-social-security.json',
	_HR_SALARY_SOCIAL_SUBSIDY_DOWN_TEMPLATE_GET: '/_hr/human/social-security/download-template.json',


	/**
	 * hr 推荐微一案师傅弹窗列表
	 */
	_HR_ARCHIVES_PERSON_CENTER_RECOMMEND_MASTER_LIST_GET: '/_hr/human/personal-center/recommend-master-list.json',
	_HR_ARCHIVES_PERSON_CENTER_RECOMMEND_MASTER_EVALUATE_AUDIT_POST: '/_hr/human/master-evaluate/audit.json',
	_HR_ARCHIVES_PERSON_CENTER_RECOMMEND_MASTER_EVALUATE_REMOVE_GET: '/_hr/human/master-evaluate/remove.json',
	HR_MASTER_APPRENTICE_DEPART_LIST_GET: '/_hr/human/master-apprentice/depart-list.json',
	_HR_MASTER_APPRENTICE_DEPART_ADD_MASTER_POST: '/_hr/human/master-apprentice/add-master.json',
	_HR_MASTER_APPRENTICE_DEPART_MASTER_GET: '/_hr/human/master-apprentice/master-alert-list.json',
	_HR_MASTER_APPRENTICE_DEPART_APPRENTICE_POST: '/_hr/human/master-apprentice/add-apprentice.json',
	_HR_MASTER_APPRENTICE_APPRENTICE_GET: '/_hr/human/master-apprentice/apprentice-alert-list.json',
	_HR_MASTER_APPRENTICE_REDUCE_MASTER_POST: '/_hr/human/master-apprentice/reduce-master.json',
	_HR_MASTER_APPRENTICE_REDUCE_APPRENTICE_POST: '/_hr/human/master-apprentice/reduce-apprentice.json',
	_HR_MASTER_APPRENTICE_REDUCE_MASTER_GET: '/_hr/human/master-apprentice/cancel-master.json',
	_HR_MASTER_RULE_GET: '/_hr/human/master-rule/get-rule.json',
	_HR_MASTER_ADD_RULE_POST: '/_hr/human/master-rule/save-rule.json',
	_HR_ARCHIVES_ADD_EVALUATE_POST: '/_hr/human/master-evaluate/add.json',
	_HR_MASTER_CYCLE_YEAR_GET: '/_hr/human/master-rule/get-year-cycle.json',
	_HR__MASTER_EVALUATE_SEARCH_LIST_GET: '/_hr/human/master-evaluate/add-alert-list.json',
	HR_EMPLOYEE_RANK_UP_STORE_GET: '',
	/**
	 * hr 所有员工
	 */
	HR_PERSONNEL_MEMBER_MASTER_LIST_GET: '/_hr/human/personal-center/master-list.json',
	HR_PERSONNEL_MEMBER_RELATIONSHIP_LIST_GET: '/_hr/human/personal-center/master-apprentice.json',
	HR_PERSONNEL_MEMBER_MEMBER_STAFF_LIST_GET: '/_hr/human/personal-center/my-staff.json',
	_HR_PERSONNEL_MEMBER_MEMBER_RELATIONSHIP_ADD_MASTER_GET: '/_hr/human/personal-center/choose-master.json',
	_HR_PERSONNEL_MEMBER_MEMBER_RELATIONSHIP_ADD_APPRENTICE_GET: '/_hr/human/personal-center/choose-apprentice.json',
	_HR_PERSONNEL_MEMBER_MEMBER_RELATIONSHIP_SAVE_MASTER_POST: '/_hr/human/personal-center/add-master.json',
	_HR_PERSONNEL_MEMBER_MEMBER_RELATIONSHIP_ASSIGN_APPRENTICE_POST: '/_hr/human/personal-center/assign-apprentice.json',
	_HR_PERSONNEL_MEMBER_MEMBER_RELATIONSHIP_ASSIGN_APPRENTICE_LIST_GET: '/_hr/human/personal-center/assign-apprentice-list.json',
	_HR_PERSONNEL_MEMBER_MEMBER_RELATIONSHIP_REDUCE_APPRENTICE_DETAIL_LIST_GET: '/_hr/human/personal-center/reduce-apprentice-detail.json',
	_HR_PERSONNEL_MEMBER_MEMBER_RELATIONSHIP_REDUCE_APPRENTICE_DETAIL_POST: '/_hr/human/personal-center/reduce-apprentice.json',
	_HR_PERSONNEL_MEMBER_MASTER_REFUSE_APPLY_POST: '/_hr/human/personal-center/refuse-apply.json',
	_HR_PERSONNEL_MEMBER_MASTER_PASS_APPLY_POST: '/_hr/human/personal-center/pass-apply.json',
	_HR_PERSONNEL_MEMBER_MASTER_RECOMMEND_MASTER_LIST_GET: '/_hr/human/personal-center/recommend-master-list.json',
	_HR_PERSONNEL_MEMBER_MASTER_RECOMMEND_MASTER_SAVE_POST: '/_hr/human/personal-center/recommend-master.json',
	_HR_PERSONNEL_MEMBER_MASTER_APPLY_RATE_GET: '/_hr/human/personal-center/master-apply-rate.json',
	_HR_PERSONNEL_MEMBER_MASTER_CANCEL_MASTER_APPLY_POST: '/_hr/human/personal-center/cancel-master-apply.json',
	_HR_PERSONNEL_MEMBER_MASTER_RECOMMEND_MASTER_POST: '/_hr/human/personal-center/recommend-master.json',
	_HR_PERSONNEL_MEMBOR_CYCLE_YEAR_GET: '/_hr/human/master-evaluate/get-cycle-year.json',
	_HR_PERSONNEL_MEMBOR_CYCLE_LIST_GET: '/_hr/human/master-evaluate/get-cycle.json',
	_HR_PERSONNEL_MEMBOR_NEW_CYCLE_LIST_GET: '/_hr/human/master-evaluate/get-now-cycle.json',

	/**
	 *pk列表
	 */
	HR_ARCHIVES_ACHIE_PK_LIST_GET: '/_notice/pk/pk/performance-pk-list.json',
	_HR_ARCHIVES_ACHIE_PK_ZONE_DEPART_PK_SAVE_POST: '/_notice/pk/pk/zone-depart-pk.json',
	_HR_ARCHIVES_ACHIE_TREND_ZONE_GET: '/_finance/finance/performance/section-rank.json',
	_HR_ARCHIVES_ACHIE_TREND_DEPART_GET: '/_finance/finance/performance/depart-rank.json',
	_HR_ARCHIVES_ACHIE_TREND_STAFF_GET: '/_finance/finance/performance/staff-rank.json',
	_HR_ARCHIVES_ACHIE_GET_STAFF_BY_DEPART_GET: '/_hr/api/human/get-staffs-by-depart-id-and-manager.json',
	HR_ACADEMY_COURSE_EXAM_VIEW_GET: '',
	_HR_ARCHIVES_ACHIE_TREND_SEARCH_DEPART_GET: '/_hr/file/ranking-label/sections.json',
	_HR_ARCHIVES_ACHIE_TREND_SEARCH_DEPART_LIST_GET: '/_hr/file/ranking-label/section-list.json',
	_HR_ARCHIVES_ACHIE_TREND_SEARCH_STAFF_GET: '/_hr/file/ranking-label/staff-list.json',
	_HR_ARCHIVES_ACHIE_PK_EXPORT_GET: '/_notice/pk/pk/performance-pk-export.json',
	HR_ARCHIVES_EMPLOYEE_BUSINESS_WATCH_GET: '',


	/**
	 * 招聘试卷
	 */
	_HR_RECRUIT_SCHOOL_DIMENSION_ADD_POST: "/_hr/applicant/dimension/add.json", // 维度添加/修改
	_HR_RECRUIT_SCHOOL_QUESTION_ADD_POST: "/_hr/applicant/paper/add-question.json", // 试卷-题目-添加/修改
	_HR_RECRUIT_SCHOOL_RESULT_ADD_POST: "/_hr/applicant/paper/add-result.json", // 试卷-结果-添加/修改
	_HR_RECRUIT_SCHOOL_DIMENSION_DEL_POST: "/_hr/applicant/dimension/del.json", // 维度删除
	_HR_RECRUIT_SCHOOL_QUESTION_DEL_POST: "/_hr/applicant/paper/del-question.json", // 试卷-题目-删除
	_HR_RECRUIT_SCHOOL_RESULT_DEL_POST: "/_hr/applicant/paper/del-result.json", // 试卷-结果-删除
	_HR_RECRUIT_SCHOOL_JOBFAIR_PAPER_GET: '/_hr/applicant/paper/paper-list.json',

	_HR_RECRUIT_PAPER_LIST_DETAIL_GET: '/_hr/applicant/paper/detail.json',
	_HR_SYSTEM_POSITION_USE_GET: '/_hr/human/position/get-position-by-first-depart-id.json',
	_HR_RECRUIT_SCHOOL_PAPER_DEL_POST: "/_hr/applicant/paper/del.json", // 试卷删除
	_HR_RECRUIT_SCHOOL_IMPORT_QUESTION_POST: "/_hr/applicant/paper/import-paper-question.json", // 导入试题
	_HR_RECRUIT_SCHOOL_DOWNLOAD_TEMPLATE_POST: "/_hr/applicant/paper/download-template.json", // 试题导入 -- 下载模板
	_HR_RECRUIT_SCHOOL_PAPER_ANSWER_POST: "/_hr/applicant/paper/answer.json", // 答题


	_HR_RECRUIT_SCHOOL_PAPER_DETAIL_GET: "/_hr/applicant/paper/detail.json", // 试卷详情
	_HR_RECRUIT_SCHOOL_DIMENSION_LIST_GET: "/_hr/applicant/dimension/list.json", // 维度列表
	_HR_RECRUIT_SCHOOL_QUESTION_PREVIEW_GET: "/_hr/applicant/paper/paper-question-preview.json", // 试题预览



	HR_RECRUIT_SCHOOL_PAPER_LIST_GET: "/_hr/applicant/paper/list.json", // 试卷列表

	_HR_RECRUIT_MEETING_JOIN_INFO_POST: '/_hr/applicant/meeting/edit-join-info.json',
	_HR_MERTING_RESUME_CODE_DOWNLOAD_GET: '/_hr/applicant/meeting/download-resume-code.json',



	/**
	 *为了后端导入师徒关系旧数据-临时接口
	 */
	_HR_MENTOR_RELATION_IMPORT_POST: '/_hr/human/master-evaluate/import-history.json',
	HR_RECRUIT_SCHOOL_SUMMARY_EDIT_GET: '',
	HR_RECRUIT_SOCIAL_ENTRY_GET: '',
	HR_RECRUIT_SCHOOL_ENTRY_GET: '',
	HR_RECRUIT_SOCIAL_INTERVIEW_GET: '',
	HR_RECRUIT_ENTRY_DETAIL_GET: '',
	HR_RECRUIT_RESUME_IMG_GET: '',
	HR_RECRUIT_SOCIAL_IDENTIFY_GET: '',
	HR_RECRUIT_SCHOOL_IDENTIFY_DETAIL_GET: '',
	HR_RECRUIT_SCHOOL_IDENTIFY_DETAIL_LIST_GET: '/list',
	HR_RECRUIT_SOCIAL_IDENTIFY_DETAIL_GET: '',
	HR_RECRUIT_SOCIAL_IDENTIFY_DETAIL_LIST_GET: '/list',
	HR_CONSULTATION_GET: '',
	HR_EMPLOYEE_SCORE_INTEGRATION_LEADIN_GET: '',
	HR_EMPLOYEE_SCORE_CREDIT_LEADIN_GET: '',
	_HR_SCORE_LEADIN_ITEM_VALIDATE_POST: '/_hr/train/integral/validate-import-data.json',
	_HR_SCORE_LEADIN_EXPORT_LIST_POST: '/_hr/train/integral/export-error-data.json',
	HR_RECRUIT_TALENT_LEAVE_GET: '',
	HR_RECRUIT_TALENT_LEAVE_LIST_GET: '/_hr/applicant/leave/index.json',
	HR_RECRUIT_TALENT_INVITE_OBSOLETE_GET: '',
	HR_PERSONNEL_CURRENCY_GET: '',
	HR_PERSONNEL_CURRENCY_LIST_GET: '/_cms/prop/we-coin/staff-coin-settle-list.json',
	_HR_PERSONNEL_CURRENCY_BASE_COIN_GET: '/_cms/prop/we-coin/staff-base-coin-info.json',
	_HR_PERSONNEL_CURRENCY_COIN_POLICY_IMG_GET: '/_cms/prop/we-coin/get-coin-policy-img.json',

	HR_PERSONNEL_REPORT_GET: '',
	HR_PERSONNEL_REPORT_LIST_GET: '/_sale/sale/report/list.json',
	HR_PERSONNEL_CURRENCY_REWARDS_GET: '',
	_HR_PERSONAL_REPORT_DETAIL_GET: "/_sale/sale/report/detail.json", // 举报详情
	_HR_PERSONAL_REPORT_DEFEND_POST: "/_sale/sale/report/defend.json", // 发起辩护

	HR_PERSONNEL_MEMBER_DISTRIBUTION_GET: '',
	HR_PERSONNEL_MEMBER_DISTRIBUTION_LIST_GET: '/_hr/applicant/school-assign/school-assign-manager-list.json',
	HR_PERSONNEL_MEMBER_DETAIL_GET: '',
	HR_TOOL_MODULES_EDIT_GET: ''
};
export default api;
