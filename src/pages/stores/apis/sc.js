const api = {
	/**
	 * 请注释模块内容
	 */
	/**
	 * 立客户-首页
	 */
	SC_MAIN_SCHEDULE_GET: '/_sc/center/cooperation-index/get-remind-record-by-date.json', // 首页当月每日提醒展示

	_SC_MAIN_CONTRACT_AUDIT_GET: '/_sc/center/cooperation-index/get-contract-auditing-record.json', // 首页审核信息
	_SC_MAIN_MAKE_PRODUCT_GET: '/_sc/center/cooperation-index/get-make-product-record.json', // 首页人员制作完成数量
	_SC_MAIN_CONTRACT_GET: '/_sc/center/cooperation-index/get-contract-operate-record.json', // 首页合同动态
	_SC_MAIN_MAKE_PROCESS_GET: '/_sc/center/cooperation-index/get-make-progress-list.json', // 首页产品制作进度
	_SC_MAIN_MONTH_REMIND_GET: '/_sc/center/cooperation-index/get-remind-record.json', // 首页提醒本月安排展示
	_SC_MAIN_DAY_REMIND_GET: '/_sc/center/cooperation-index/get-remind-record-by-date.json', // 首页当月每日提醒展示
	_SC_CUSTOMER_COOPERATE_GET_SUPPLY_GET: "/_sc/center/cooperation-index/get-supply-list.json", // 补款列表接口
	_SC_CUSTOMER_COOPERATE_STEP_REMING_GET: "/_sc/center/index/step-remind.json", // 制作步骤提醒

	SC_MAIN_SUPPLIST_LIST_GET: "/_sc/center/cooperation-index/get-supply-list.json", // 补款列表接口

	_SC_MAIN_ADD_REMIND_POST: '/_sc/center/cooperation-index/add-remind-record.json', // 首页添加提醒记录
	_SC_MAIN_DEL_REMIND_POST: '/_sc/center/cooperation-index/del-remind-record.json', // 首页删除提醒记录
	_SC_MAIN_COMPLETE_REMIND_POST: '/_sc/center/cooperation-index/complete-remind-record.json', // 首页完成提醒记录
	_SC_MAIN_EDIT_REMIND_POST: '/_sc/center/cooperation-index/save-remind-record.json', // 首页编辑修改提醒记录
	_SC_MAIN_SUPPLY_IGNORE_POST: '/_sc/center/cooperation-index/supply-ignore.json', // 忽略补款

	/**
	 * 立客户-合作客户
	 */
	SC_CUSTOMER_COOPERATE_GET: '',
	SC_CUSTOMER_COOPERATE_LIST_GET: '/_sc/center/cooperation-customers/get-contract-product-list.json',
	_SC_CUSTOMER_COOPERATE_DETAIL_HEADER_GET: '/_sc/center/cooperation-customers/get-contract-project-info.json', // 客户信息最上面部分详情
	_SC_CUSTOMER_COOPERATE_DEPARTMENT_GET: '/_sc/center/cooperation-customers/get-depart-list.json', // 部门
	_SC_CUSTOMER_COOPERATE_DOWNLOAD_GET: '/_sc/center/cooperation-customers/down-load-customers-list.json', // 项目列表导出
	_SC_CUSTOMER_COOPERATE_MAIN_PERSON_GET: '/_sc/center/cooperation-customers/get-main-person.json', // 获取主负责人列表
	_SC_CUSTOMER_COOPERATE_DISTRIBUTE_RECORD_GET: "/_sc/center/cooperation-customers/get-distribute-record.json", // 分配记录列表
	_SC_CUSTOMER_COOPERATE_DISTRIBUTE_PERSON_GET: "/_sc/center/cooperation-customers/get-distribute-person.json", // 获取所有分配人员
	_SC_CUSTOMER_COOPERATE_PRODUCT_DETAIL_GET: "/_sc/center/cooperation-customers/get-product-detail.json", // 获取要分配的产品信息
	_SC_CUSTOMER_COOPERATE_STEP_INFO_GET: "/_sc/center/cooperation-customers/get-step-info.json", // 制作流程
	_SC_CUSTOMER_COOPERATE_DELIVERY_GET: "/_sc/center/project/project-delivery.json", // 获取交付表信息
	_SC_CUSTOMER_COOPERATE_COMPONENT_INFO_GET: "/_sc/center/product-make/get-step-component-info.json", // 产品制作步骤元件
	_SC_CUSTOMER_COOPERATE_STEP_RECORD_GET: "/_sc/center/product-make/get-step-record-list.json", // 产品制作步骤记录展示
	_SC_CUSTOMER_COOPERATE_RELATION_PROJECT_GET: "/_sc/center/cooperation-customers/get-relation-project-list.json", // 关联项目列表
	_SC_CUSTOMER_COOPERATE_SERVICE_GET: "/_sale/api/statistics/service-center-project.json", // 立客户首页项目统计
	_SC_CUSTOMER_COOPERATE_PROCESS_GET: "/_sc/center/product-make/get-make-progress.json", // 获取产品制作进度
	_SC_CUSTOMER_COOPERATE_EDIT_GET: "/_sc/center/product-make/get-edit-record.json", // 产品制作步骤记录修改弹框内容展示接口
	_SC_CUSTOMER_COOPERATE_DISTRIBUTE_INFO_GET: "/_sc/center/cooperation-index/get-distribute-info.json", // 首页单量更多接口
	_SC_CUSTOMER_COOPERATE_GET_PRODUCT_TRACK_RECORD_GET: "/_sc/center/product-record/get-product-track-record.json", // 单独获取跟进记录接口
	_SC_CUSTOMER_COOPERATE_GET_EDIT_TRACK_RECORD_GET: "/_sc/center/product-make/get-edit-track-record.json", // 产品制作跟进记录修改弹框内容展示接口
	_SC_CUSTOMER_COOPERATE_EDIT_CUSTOMER_INFO_GET: "/_sc/center/cooperation-customers/get-edit-contract-customer-info.json", // 展示编辑客户信息
	_SC_CUSTOMER_COOPERATE_EDIT_CUSTOMER_LABEL_SETTING_GET: "/_sc/center/label-setting/get-edit-info.json", // 获取表头数据
	SC_CUSTOMER_COOPERATE_OUTBOX_LIST_GET: "/_public/email/email/list.json", // 合同客户发邮件
	_SC_CUSTOMER_COOPERATE_SEND_EMAIL_SHOW_GET: "/_public/email/email/show.json", // 发件时展示页面
	_SC_CUSTOMER_COOPERATE_LOOK_EMAIL_DETAIL_GET: "/_public/email/email/detail.json", // 详情
	_SC_CUSTOMER_COOPERATE_OTHER_CONTRACT_GET: "/_sale/sale/contract/other-contract.json", // 客户合同-查看详情-其他合同
	_SC_CUSTOMER_COOPERATE_BUFF_CUSTOMER_GET: "/_sc/center/project/get-butt-customer.json", // 获取添加记录
	_SC_CUSTOMER_COOPERATE_RELATION_CONTRACT_GET: "/_sc/center/project/project-relation-contract.json", // 项目关联合同
	_SC_CUSTOMER_COOPERATE_OTHER_SETTING_CONTRACT_GET: "/_sc/center/project/other-setting.json", // 其他设置 -- 获取
	_SC_CUSTOMER_COOPERATE_CUSTOMER_INFO_GET: "/_sale//sale/contract/project-customer-info.json", // 客户合同-查看详情-客户信息
	_SC_CUSTOMER_COOPERATE_ORDER_SETTING_LIST_GET: "/_sc/center/product/product-setting-list.json", // 单量设置列表
	_SC_CUSTOMER_COOPERATE_RELATION_CANCEL_GET: "/_sc/center/project/relation-cancel.json", // 取消关联
	_SC_CUSTOMER_COOPERATE_PROJECT_COMPLETE_ADD_GET: "/_sc/center/project/project-complete-add.json", // 项目完成表 -- 上传
	_SC_CUSTOMER_COOPERATE_COMPANY_SEARCH_GET: "/_sc/center/project/company-search.json", // 工作登记信息获取
	_SC_CUSTOMER_COOPERATE_WORK_RECORD_GET: "/_sc/center/project/work-record.json", // 工作概况测弹窗
	_SC_CUSTOMER_COOPERATE_WORK_INFO_GET: "/_sc/center/project/work-info.json", // 工作登记信息详情
	_SC_CUSTOMER_COOPERATE_TICKET_GET: "/_sc/center/project/ticket-list.json", // 服务凭证列表

	_SC_CUSTOMER_COOPERATE_AUDITING_POST: "/_sc/center/cooperation-customers/auditing-project.json", // 审核项目
	_SC_CUSTOMER_COOPERATE_BUTT_POST: "/_sc/center/cooperation-customers/change-butt-customer.json", // 审核项目
	_SC_CUSTOMER_COOPERATE_COST_POST: "/_sc/center/project/change-cost.json", // 修改成本
	_SC_CUSTOMER_COOPERATE_SAVE_PERSON_POST: "/_sc/center/cooperation-customers/save-main-person.json", // 保存主要负责人
	_SC_CUSTOMER_COOPERATE_MAKE_POST: "/_sc/center/cooperation-customers/set-is-make.json", // 是否需要制作
	_SC_CUSTOMER_COOPERATE_DISTRIBUTE_MAKE_POST: "/_sc/center/cooperation-customers/save-distribute-make.json", // 子产品分配
	_SC_CUSTOMER_COOPERATE_COMPLETE_PRODUCT_POST: "/_sc/center/cooperation-customers/complete-product.json", // 手动完成制作
	_SC_CUSTOMER_COOPERATE_VALID_POST: "/_sc/center/cooperation-customers/save-valid.json", // 是否计入有效单
	_SC_CUSTOMER_COOPERATE_TIME_SET_POST: "/_sc/center/cooperation-customers/save-time-setting.json", // 时间设定
	_SC_CUSTOMER_COOPERATE_MAKE_RECORD_POST: "/_sc/center/cooperation-customers/save-make-record.json", // 添加制作记录
	_SC_CUSTOMER_COOPERATE_DEL_RECORD_POST: "/_sc/center/cooperation-customers/del-record.json", // 删除步骤记录
	_SC_CUSTOMER_COOPERATE_TRACK_RECORD_POST: "/_sc/center/product-make/save-track-record.json", // 产品制作添加跟进记录
	_SC_CUSTOMER_COOPERATE_COMPLETE_STEP_POST: "/_sc/center/cooperation-customers/complete-step.json", // 完成步骤
	_SC_CUSTOMER_COOPERATE_RELATION_CONTRACT_POST: "/_sc/center/cooperation-customers/relation-contract.json", // 关联合同
	_SC_CUSTOMER_COOPERATE_COST_SET_POST: "/_sc/center/project/save-setting.json", // 其他设置 — 保存
	_SC_CUSTOMER_COOPERATE_DEL_DELIVERY_POST: "/_sc/center/cooperation-customers/del-delivery-img.json", // 删除交付表接口
	_SC_CUSTOMER_COOPERATE_AUDIT_DELIVERY_POST: "/_sc/center/cooperation-customers/audit-delivery.json", // 审核交接表信息
	_SC_CUSTOMER_COOPERATE_SET_SUBMIT_POST: "/_sc/center/product-make/set-is-submit.json", // 保存已提交给设计接口
	_SC_CUSTOMER_COOPERATE_CHANGE_RECORD_POST: "/_sc/center/product-make/change-record.json", // 修改步骤记录
	_SC_CUSTOMER_COOPERATE_ADD_EXCEPTION_RECORD_POST: "/_sc/center/product-record/add-exception-record.json", // 添加异常记录接口
	_SC_CUSTOMER_COOPERATE_EDIT_TRACK_RECORD_POST: "/_sc/center/product-make/edit-track-record.json", // 产品制作跟进记录修改接口
	_SC_CUSTOMER_COOPERATE_DEL_TRACK_RECORD_POST: "/_sc/center/product-make/del-track-record.json", // 删除产品制作跟进记录
	_SC_CUSTOMER_COOPERATE_SAVE_CUSTOMER_INFO_POST: "/_sc/center/cooperation-customers/save-contract-customer-info.json", // 客户详情-修改客户信息
	_SC_CUSTOMER_COOPERATE_SAVE_LABEL_SETTINGS_POST: "/_sc/center/label-setting/save-settings.json", // 保存表头
	_SC_CUSTOMER_COOPERATE_TAG_ADD_POST: "/_sc/center/project/tag-add.json", // 添加标签
	_SC_CUSTOMER_COOPERATE_TAG_DEL_POST: "/_sc/center/project/tag-del.json", // 删除标签
	_SC_CUSTOMER_COOPERATE_TOP_ADD_POST: "/_sc/center/project/top-add.json", // 添加置顶
	_SC_CUSTOMER_COOPERATE_TOP_DEL_POST: "/_sc/center/project/top-del.json", // 删除置顶
	_SC_CUSTOMER_COOPERATE_OUTBOX_POST: "/_public/email/email/del.json", // 删除邮件
	_SC_CUSTOMER_COOPERATE_SEND_EMAIL_POST: "/_public/email/email/send.json", // 发邮件
	_SC_CUSTOMER_COOPERATE_MAKET_HANDOVER_POST: "/_sc/center/product-make/not-handover.json", // 无需交接表
	_SC_CUSTOMER_COOPERATE_ORDER_SETTING_POST: "/_sc/center/product/product-setting-save.json", // 保存单量设置
	_SC_CUSTOMER_COOPERATE_WORK_ADD_POST: "/_sc/center/project/work-add.json", // 工作登记信息新增、编辑
	_SC_CUSTOMER_COOPERATE_WORK_DEL_POST: "/_sc/center/project/work-del.json", // 工作登记信息删除
	_SC_CUSTOMER_COOPERATE_TICKET_ADD_POST: "/_sc/center/project/ticket-add.json", // 添加服务凭证
	_SC_CUSTOMER_COOPERATE_TICKET_DEL_POST: "/_sc/center/project/ticket-del.json", // 服务凭证删除
	_SC_CUSTOMER_COOPERATE_COMPLETE_TIME_EDIT_POST: "/_sc/center/project/complete-time-edit.json", // 修改完成时间

	/**
	 * 立客户-退款申请
	 */
	SC_CUSTOMER_REFUND_GET: '',
	SC_CUSTOMER_REFUND_LIST_GET: '/_sale/sale/refund/list.json', // 退款申请列表
	_SC_CUSTOMER_REFUND_INFO_GET: '/_sc/center/refund/get-refund-info.json', // 退款申请详细信息
	_SC_CUSTOMER_REFUND_RECORD_GET: '/_sc/center/refund/get-auditing-record.json', // 退款审核记录
	_SC_CUSTOMER_REFUND_APPLY_INFO_GET: '/_sc/center/refund/get-money-info.json', // 退款审核记录
	_SC_CUSTOMER_REFUND_DEPARTMENTS_GET: '/_hr/human/depart/all.json', // 获得全部部门 (除公司)-- 树状图
	_SC_CUSTOMER_REFUND_SERVICE_REFUND_GET: '/_sale/api/statistics/service-center-refund.json', // 立客户首页退款统计

	_SC_CUSTOMER_REFUND_AUDIT_POST: "/_sc/center/refund/auditing-refund.json", // 退款申请操作
	_SC_CUSTOMER_REFUND_PROJECT_POST: "/_sc/center/refund/get-project-demand-info.json", // 退款申请操作

	/**
	 * 立客户-产品制作
	 */
	SC_PRODUCT_GET: '',
	SC_PRODUCT_LIST_GET: '/_sc/center/product-make/get-make-list.json', // 产品制作列表
	_SC_PRODUCT_DEPARTMENT_GET: '/_sc/center/cooperation-customers/get-depart-list.json', // 部门
	_SC_PRODUCT_GET_SUPPLEMENT_RECORD_GET: '/_sc/center/cooperation-customers/get-supplement-record.json', // 项目补款记录

	/**
	 * 立客户-导出设置
	*/
	SC_CUSTOMER_COOPERATE_EXPORT_GET: '',
	SC_CUSTOMER_COOPERATE_EXPORT_LIST_GET: '/_sc/center/cooperation-customers/get-template-list.json', // 导出模板列表
	_SC_CUSTOMER_COOPERATE_EXPORT_CONTENT_GET: '/_sc/center/cooperation-customers/get-export-setting-info.json', // 导出设置内容
	_SC_CUSTOMER_COOPERATE_EXPORT_PRODUCT_GET: '/_sc/center/cooperation-customers/get-product-list.json', // 导出设置产品列表
	_SC_CUSTOMER_COOPERATE_EXPORT_PRODUCT_TYPE_GET: '/_sc/center/cooperation-customers/get-product-type.json', // 导出产品类型
	_SC_CUSTOMER_COOPERATE_EXPORT_EDIT_GET: '/_sc/center/cooperation-customers/get-edit-setting-info.json', // 展示编辑模板

	_SC_CUSTOMER_COOPERATE_EXPORT_ADD_POST: '/_sc/center/cooperation-customers/add-export-setting-template.json', // 添加导出模板
	_SC_CUSTOMER_COOPERATE_EXPORT_TEMPLATE_POST: '/_sc/center/cooperation-customers/relation-template.json', // 导出产品关联模板
	_SC_CUSTOMER_COOPERATE_EXPORT_EDIT_REMARK_POST: '/_sc/center/cooperation-customers/edit-remark.json', // 修改模板备注
	_SC_CUSTOMER_COOPERATE_EXPORT_DEL_TEMPLATE_POST: '/_sc/center/cooperation-customers/del-template.json', // 删除模板
	_SC_CUSTOMER_COOPERATE_EXPORT_EDIT_TEMPLATE_POST: '/_sc/center/cooperation-customers/edit-export-setting-template.json', // 编辑导出模板,
	SC_CUSTOMER_COOPERATE_EXPORTTASK_GET: '',
	SC_CUSTOMER_COOPERATE_EXPORTTASK_LIST_GET: '/_sc/center/cooperation-customers/down-list.json', // 导出任务-列表
	_SC_CUSTOMER_COOPERATE_EXPORTTASK_DOWN: '/_sc/center/cooperation-customers/down.json', // 文件下载,
	SC_CUSTOMER_COOPERATE_DISTRIBUTE_GET: '',
	SC_CUSTOMER_COOPERATE_DISTRIBUTE_LIST_GET: '/_sc/center/cooperation-customers/assign-count.json', // 单量和分配列表

	/**
	 * OA意见反馈箱
	*/
	SC_VIEWS_LIST_GET: '/_tech/tech/issue/list.json', // 列表
	_SC_VIEWS_LIST_GET: '/_auth/auth/public/menus.json', // 根据父级ID获取子集功能
	_SC_VIEWS_TECH_ADD_GET: '/_tech/tech/issue/add.json', // 意见反馈箱-新增、修改
	_SC_VIEWS_ISSUE_DETAIL_GET: '/_tech/tech/issue/detail.json', // 意见反馈箱-详情
	_SC_VIEWS_STAFF_GET: '/_hr/human/staff/get-staff-by-search.json', // 回复人

	SC_REPLY_ANSWER_LIST_GET: '/_tech/tech/issue/list.json',

	_SC_VIEWS_APPLY_POST: '/_tech/tech/issue/apply.json', // 意见反馈箱-回复
	_SC_VIEWS_CHANGE_POST: '/_tech/tech/issue/change.json', // 意见反馈箱-状态变更

	/**
	 * 质检管理
	 */
	SC_MANAGE_INSPECTION_LIST_GET: '/_sc/center/quality/list.json', // 质检列表
	_SC_MANAGE_INSPECTION_ASSIGN_LIST_GET: '/_sc/center/quality/assign-list.json', // 分配人员列表
	_SC_MANAGE_INSPECTION_QUALITY_LIST_GET: '/_sc/center/quality/quality-record-list.json', // 回访记录
	_SC_MANAGE_INSPECTION_QUALITY_RECORD_DETAIL_GET: '/_sc/center/quality/quality-record-detail.json', // 回访跟进详情
	_SC_MANAGE_INSPECTION_QUALITY_RECORD_INFO_GET: '/_sc/center/quality/quality-record-info.json', // 回访编辑详情
	_SC_MANAGE_INSPECTION_QUALITY_CUSTOMER_BASE_INFO_GET: '/_sc/center/quality/customer-base-info.json', // 客户基本信息
	_SC_MANAGE_INSPECTION_QUALITY_CUSTOMER_INFO_GET: '/_sc/center/quality/customer-info.json', // 客户信息
	_SC_MANAGE_INSPECTION_QUALITY_SERVICE_INFO_GET: '/_sc/center/quality/service-info.json', // 服务情况
	_SC_MANAGE_INSPECTION_QUALITY_GET_STAFF_GET: '/_hr/human/staff/get-staff-by-search.json', // 投诉员工
	_SC_MANAGE_INSPECTION_QUALITY_COMPLAINT_INFO_GET: '/_sc/center/quality/complaint-info.json', // 投诉详情
	_SC_MANAGE_INSPECTION_QUALITY_COMPLAINT_LIST_GET: '/_sc/center/quality/complaint-list.json', // 投诉列表
	_SC_MANAGE_INSPECTION_QUALITY_INTERRAL_LIST_GET: '/_sc/center/quality/integral-list.json', // 客户回款信息
	_SC_MANAGE_INSPECTION_QUALITY_PRODUCT_PROCESS_GET: '/_sc/center/quality/product-process.json', // 产品制作进度
	_SC_MANAGE_INSPECTION_QUALITY_SATISFACTION_GET: '/_sc/center/quality/satisfaction-list.json', // 客户满意度
	_SC_MANAGE_INSPECTION_QUALITY_PRODUCT_GET: '/_cms/product/product/get-products.json', // 产品 - 下拉选择产品
	_SC_MANAGE_INSPECTION_QUALITY_SET_PERIOD_GET: '/_sc/center/quality/get-and-set-period.json', // 设置获取质检周期
	_SC_MANAGE_INSPECTION_QUALITY_HATE_GET: '/_sc//center/quality/hate-reason-list.json', // 不满意原因列表
	_SC_MANAGE_INSPECTION_QUALITY_SCORE_GET: '/_sc/center/service-score-product/get-score-items.json', // 获取公司服务评分项
	_SC_MANAGE_INSPECTION_QUALITY_CONTRACT_INFO_DELET_GET: '/_sc/center/contact/delete.json', // 质检客户信息-联系人信息删除
	_SC_MANAGE_INSPECTION_QUALITY_CALL_HISTORY_GET: '/_sale/sale/dialing-recording/get-call-record.json', // 质检通话记录列表
	_SC_MANAGE_INSPECTION_RECORD_GET: '/_cms/activity/activity-apply/get-apply-record-by-customer.json', // 质检 - 上课记录
	_SC_MANAGE_INSPECTION_QUALITY_SERVICE_SCORE_GET: '/_sc/center/service-score-product/get-quality-service-score.json', // 获取最新增值服务评分

	_SC_MANAGE_INSPECTION_OPERATE_POST: '/_sc/center/quality/operate.json', // 操作质检
	_SC_MANAGE_INSPECTION_ADD_OPERATE_RECORD_POST: '/_sc/center/quality/add-quality-record.json', // 回访
	_SC_MANAGE_INSPECTION_QUALITY_RESOLVE_POST: '/_sc/center/quality/quality-resolve.json', // 标记解决
	_SC_MANAGE_INSPECTION_ADD_COMPLAINT_POST: '/_sc/center/quality/add-complaint.json', // 添加投诉
	_SC_MANAGE_INSPECTION_EDIT_COMPLAINT_POST: '/_sc/center/quality/edit-complaint.json', // 编辑投诉
	_SC_MANAGE_INSPECTION_COMPLAINT_DELETE_POST: '/_sc/center/quality/complaint-delete.json', // 删除投诉
	_SC_MANAGE_INSPECTION_EXPORT_POST: '/_sc/center/quality/export.json', // 质检列表导出
	_SC_MANAGE_INSPECTION_QUALITY_CONTRACT_LIST_GET: '/_sc/center/contact/list.json', // 质检客户信息-联系人信息列表
	_SC_MANAGE_INSPECTION_QUALITY_CONTRACT_INFO_GET: '/_sc/center/contact/info.json', // 质检客户信息-联系人信息详情
	_SC_MANAGE_INSPECTION_QUALITY_CONTRACT_INFO_ADD_POST: '/_sc/center/contact/add.json', // 质检客户信息-联系人信息添加
	_SC_MANAGE_INSPECTION_QUALITY_CONTRACT_INFO_EDIT_POST: '/_sc/center/contact/edit.json', // 质检客户信息-联系人信息编辑
	
	/**
	 * 服务质检
	 */
	SC_SERVICE_INSPECTION_LIST_GET: '/_sc/center/quality/service-quality-list.json', // 服务质检列表
	SC_SERVICE_INSPECTION_RECORD_LIST_GET: '/_sc/center/quality/service-quality-record-list.json', // 服务质检记录列表

	/**
	 * 立客户-预分配
	*/
	SC_CUSTOMER_PREDISTRIBUTE_LIST_GET: '/_sc/center/assign-make/list.json', // 预分配-列表
	_SC_CUSTOMER_PREDISTRIBUTE_DETAIL_GET: '/_sc/center/assign-make/detail.json', // 预分配-详情
	_SC_CUSTOMER_PREDISTRIBUTE_STAFF_LIST_GET: '/_sc/center/assign-make/staff-list.json', // 预分配-选择主要负责人
	_SC_CUSTOMER_PREDISTRIBUTE_EDIT_RECORD_POST: '/_sc/center/quality/edit-quality-record.json', // 预分配-选择主要负责人

	_SC_CUSTOMER_PREDISTRIBUTE_ASSIGN_MAIN_POST: '/_sc/center/assign-make/assign-main.json', // 预分配-分配主负责人
	_SC_CUSTOMER_PREDISTRIBUTE_ASSIGN_CHILD_POST: '/_sc/center/assign-make/assign-child.json', // 预分配-分配子负责人
	_SC_CUSTOMER_PREDISTRIBUTE_NOT_MAKE_POST: '/_sc/center/assign-make/not-make.json', // 预分配-无需制作

	/**
	 * 立客户-交接表审核
	*/
	SC_CUSTOMER_HANDOVER_GET: '',
	SC_CUSTOMER_HANDOVER_LIST_GET: '/_sc/center/project/delivery-list.json', // 交接表审核 -- 列表
	_SC_CUSTOMER_HANDOVER_DELIVERY_DETAIL_GET: '/_sc/center/project/delivery-detail.json', // 交付表审核 -- 详情
	_SC_CUSTOMER_HANDOVER_PRODUCT_GET: '/_sc/center/project/delivery-product-list.json', // 交接表审核 - 产品下拉框

	_SC_CUSTOMER_HANDOVER_DELIVERY_AUDIT_POST: '/_sc/center/project/delivery-audit.json', // 交付表审核 -- 审核
	_SC_CUSTOMER_HANDOVER_DELIVERY_ADD_POST: '/_sc/center/project/delivery-add.json', // 交付表 -- 上传,
	SC_CONSULTATION_GET: '',
	SC_SERVICE_MANAGE_GRADE_GET: '',
	SC_MANAGE_INSPECTION_GRADE_LIST_GET: '/_sc/center/service-score-product/list.json',
	_SC_SERVICE_MANAGE_GRADE_SCORE_LIST_GET: '/_sc/center/service-score-product/score-list.json', // 增值服务评分项列表
	_SC_SERVICE_MANAGE_GRADE_PRODUCT_LIST_GET: '/_sc/center/service-score-product/product-list.json', // 关联产品列表

	_SC_SERVICE_MANAGE_GRADE_EDIT_POST: '/_sc/center/service-score-product/edit.json', // 编辑评分项
	_SC_SERVICE_MANAGE_GRADE_SET_PRODUCTS_POST: '/_sc/center/service-score-product/set-products.json', // 关联产品

	/**
	 * 质检数据统计
	 */
	_SC_MANAGE_STATISTICS_HATE_REASON: '/_sc/center/quality-static/hate-type-reason.json', // 不满意原因统计
	_SC_MANAGE_STATISTICS_SERVICE_SCORE: '/_sc/center/quality-static/service-score.json', // 服务评分统计
	_SC_MANAGE_STATISTICS_ADD_SERVICE_SCORE: '/_sc/center/quality-static/add-service-score.json', // 增值服务评分统计
	SC_MANAGE_STATISTICS_MARKET_LIST_GET: '/_sc/center/quality-static/service-quality-list.json',
	SC_SERVICE_MANAGE_STATISTICS_MARKET_EXPORT_GET: '',

	/*
	 * 市场服务数据
	*/ 
	SC_MANAGE_STATISTICS_MARKET_EXPORT_LIST_GET: '/_sc/center/quality-static/excel-list.json',
	_SC_SERVICE_MANAGE_STATISTICS_MARKET_EXPORT_GET: '/_sc/center/quality-static/export.json',
	SC_MANAGE_STATISTICS_MARKET_DETAIL_LIST_GET: '/_sc/center/quality-static/company-quality-list.json', // 服务数据详情列表
	_SC_MANAGE_STATISTICS_MARKET_DETAIL_LIST_EXPORT_GET: '/_sc/center/quality-static/sale-company-quality-export.json', // 服务数据详情列表导出
};

export default api;
