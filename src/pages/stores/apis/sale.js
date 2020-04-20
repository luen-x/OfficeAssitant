const api = {
	/**
	 * 请注释模块内容
	 */
	/**
	 * 首页
	 */
	SALE_MAIN_GET: "",
	// 业绩目标
	_SALE_MAIN_TARGET_PROPORTION_GET: "/_sale/sale/target-plan/proportion.json", // 获取业绩百分比
	_SALE_MAIN_TARGET_DETAIL_GET: "/_sale/sale/target-plan/info.json", // 查看业绩详情
	_SALE_MAIN_TARGET_CREATE_POST: "/_sale/sale/target-plan/save.json", // 查看业绩设置
	_SALE_MAIN_TARGET_SET_POST: "/_sale/sale/target-manage/create-and-edit.json", // 业绩开启关闭设置
	_SALE_MAIN_TARGET_IS_OPEN_GET: "/_sale/sale/target-manage/detail.json", // 查看关闭设置
	_SALE_MAIN_SEND_NOTICE_GET: "/_cms/notice/notice/send-notice.json", // 消息通知
	_SALE_MAIN_IS_READ_NOTICE_POST: "/_cms/notice/notice/one-read.json", // 标记已读

	_SALE_MAIN_TARGET_SAVE_TYPE_GET: "/_sale/sale/target/save-type.json", // 下拉选择不同时段的基础信息
	_SALE_MAIN_BUSINESS_LESSON_LECTURER_GET: "/_business/lesson/schedule/lecturer-lesson.json", // 销售公告栏-讲师课表
	_SALE_MAIN_DEPART_PERFORMANCE_LIST_GET: "/_finance/api/commission/depart-performance-list.json", // 部门业绩--销售首页
	_SALE_MAIN_STAFF_PERFORMANCE_LIST_GET: "/_finance/api/commission/staff-performance-list.json", // 部门业绩--销售首页
	_SALE_MAIN_TARGET_CONFIG_GET: "/_sale/sale/target-config/get-config.json", // 获取配置季度列表
	_SALE_MAIN_TARGET_DEL_CONFIG_GET: "/_sale/sale/target-config/del-config.json", // 获取配置季度列表
	_SALE_MAIN_TARGET_SAVE_CONFIG_GET: "/_sale/sale/target-config/set-config.json", // 获取配置季度列表
	_SALE_MAIN_QUALITY_STATIC_SERVICE_GET: "/_sc/center/quality-static/sale-service-score.json", // 获取配置季度列表
	_SALE_MAIN_NEW_CUSTOMER_GET: "/_sale/sale/statistics-customer/first-page-statistics.json", // 新增客户统计
	// _SALE_MAIN_MORE_NEW_CUSTOMER_GET: "/_sale/sale/statistics-customer/first-page-statistics-line-chart.json", // 新增客户统计
	_SALE_MAIN_STAFF_GET_STAFF_IDENTITY_GET: "/_hr/human/staff/get-staff-identity.json", // 兼部门判断
	SALE_MAIN_WORK_DATA_DETAIL_LIST_GET: "/_sale/sale/statistics-customer/first-page-statistics-side-list.json", //  首页统计-更多-侧弹窗-列表
	_SALE_MAIN_NEW_CUSTOMER_SHOW_DEPART_SEARCH_GET: '/_hr/human/staff/is-show-depart-select-by-staff-id.json', // 新增员工- 是否显示部门搜索
	_SALE_MAIN_NEW_CUSTOMER_SHOW_STAFF_SEARCH_GET: "/_hr/api/human/get-departs-manage-by-staff-id.json", // 新增员工- 是否显示员工搜索


	_SALE_MAIN_FIRST_PAGE_STATISTICS_SIDE_LIST_GET: "/_sale/sale/statistics-customer/first-page-statistics-side-list.json", //  首页统计-更多-侧弹窗-列表
	_SALE_MAIN_MATTER_SCHEDULE_GET: "/_sale/sale/matter/schedule.json", // 日程安排
	_SALE_MAIN_MATTER_OPEN_POST: "/_sale/sale/matter/open.json", // 修改日历展开
	_SALE_MAIN_MATTER_SCHEDULE_MONTH_GET: '/_sale/sale/matter/schedule-month.json', // 按月获取
	_SALE_MAIN_MATTER_SCHEDULE_DATE_GET: '/_sale/sale/matter/schedule-day.json', // 按日获取
	_SALE_MAIN_MATTER_SAVE_POST: "/_sale/sale/matter/save.json", // 添加/编辑事项
	_SALE_MAIN_MATTER_DETAIL_GET: "/_sale/sale/matter/detail.json", // 事项详情
	_SALE_MAIN_MATTER_DELETE_POST: "/_sale/sale/matter/delete.json", // 删除事项
	_SALE_MAIN_MATTER_SET_REMIND_POST: "/_sale/sale/matter/set-remind.json", // 设置提醒
	_SALE_MAIN_MATTER_REMIND_RANGE_GET: "/_sale/sale/matter/get-remind-range.json", // 获取配置
	_SALE_MAIN_STATISTICS_CUSTOMER_FIRST_TAB_GET: "/_sale/sale/statistics-customer/first-page-statistics-tab.json", // 获取配置
	_SALE_MAIN_MATTER_REMIND_GET: "/_sale/sale/matter/get-remind.json", // 获取配置



	// 活动
	_SALE_MAIN_ACTIVITY_CATEGORY_GET: "/_cms/activity/activity/activity-category.json", // 活动分类
	_SALE_MAIN_ACTIVITY_IS_SELF_GET: "/_cms/activity/activity-apply/is-yourself-customer.json", // 活动是否是自己客户
	_SALE_MAIN_ACTIVITY_IS_APPLY_GET: "/_cms/activity/activity-apply/is-apply.json", // 活动是否是已经报名

	_SALE_MAIN_ACTIVEITY_DAY_LIST_GET: "/_cms/activity/activity/day-list.json", // 查看近期活动
	_SALE_MAIN_ACTIVEITY_MONTH_LIST_GET: "/_cms/activity/activity/month-list.json", // 查看近期活动
	_SALE_MAIN_ACTIVEITY_OLD_LIST_GET: "/_cms/activity/activity/old-month.json", // 查看公告里面的近月
	_SALE_MAIN_ACTIVEITY_APPLY_POST: "/_cms/activity/activity-apply/apply.json", // 活动 - 申请报名
	_SALE_MAIN_ACTIVEITY_APPLY_LIST_GET: "/_cms/activity/activity-apply/apply-list.json", // 活动 - 报名审核列表
	_SALE_MAIN_ACTIVEITY_APPLY_DETAIL_GET: "/_cms/activity/activity-apply/apply-detail.json", // 活动 - 报名审核
	_SALE_MAIN_ACTIVEITY_APPLY_EDIT_GET: "/_cms/activity/activity-apply/sale-edit-apply.json", // 活动 - 报名审核
	_SALE_MAIN_ACTIVITY_APPLY_USERS_GET: "/_cms/activity/activity-apply/get-apply-users.json", // 根据客户id获取已报名的人

	_SALE_MAIN_ACTIVEITY_APPLY_INDUSTRY_GET: "/_cms/activity/activity-apply/industry.json", // 公司行业
	_SALE_MAIN_MATERIAL_NEW_LIST_GET: "/_cms/information/information/new-list.json", // 活动 - 最新列表
	_SALE_MAIN_MATERIAL_LIST_GET: "/_cms/information/information/list.json", // 素材 - 列表素材
	_SALE_MAIN_MATERIAL_DETAIL_GET: "/_cms/material/material/detail.json", // 素材 -详情
	_SALE_MAIN_PK_DETA_GET: "/_notice/api/pk/data-pk.json", // pk业绩
	_SALE_MAIN_GET_SALE_CATEGORY_GET: "/_cms/product/product/get-sale-category.json", // 在售商品
	_SALE_MAIN_DATA_ACHIEVEMENT_GET: "/_sale/sale/target/data-achievement.json", //  首页业绩排行
	_SALE_MAIN_DATA_ACHIEVEMENT_TOP_GET: "/_sale/sale/target/top20.json", //  首页业绩排行20
	_SALE_MAIN_DATA_ACHIEVEMENT_ORDER_GET: "/_sale/sale/target-plan/more.json", //  业绩目标完成情况
	_SALE_MAIN_DATA_TARGET_PLAN_TAB_GET: "//_sale/sale/target-plan/get-tab.json", //  业绩目标完成情况
	_SALE_MAIN_ACHIEVEMENT_DEPART_ORDER_GET: "/_sale/sale/target/depart-order.json", // 部门排行
	_SALE_MAIN_ACHIEVEMENT_ZONE_ORDER_GET: "/_sale/sale/target/zone-order.json", //  战区排行
	_SALE_MAIN_ACHIEVEMENT_ORDER_TARGET_GET: "/_sale/sale/target/achievement-order.json", //  员工排行





	_SALE_MAIN_MATERIAL_RELATION_LIST_GET: "/_cms/material/material/relation-list.json", // 素材 - 详情页相关素材



	_SALE_MAIN_ACTIVEITY_DETAIL_GET: "/_cms/activity/activity/activity-details.json", // 活动 - 活动详情

	// _SALE_MAIN_ACTIVEITY_APPLY_DETAIL_GET: "/_cms/activity/activity-apply/applies.json", // 活动 - 活动完成
	_SALE_MAIN_ACTIVEITY_IS_APPLY_GET: "/_cms/activity/activity-apply/is-apply.json", // 活动 - 是否申请过
	_SALE_MAIN_ACTIVEITY_IS_YOURSELF_GET: "/_cms/activity/activity-apply/is-yourself-customer.json", // 活动 - 是否是意向客户
	_SALE_MAIN_COOPERATE_TYPE_GET: "/_cms/activity/activity-apply/cooperate-type.json", // 活动- 合作类型
	_SALE_MAIN_ACTIVEITY_RECALL_APPLY_GET: "/_cms/activity/activity-apply/recall-apply.json", // 报名活动测回

	_SALE_MAIN_EFFECTIVE_ACTIVEITY_GET: "/_cms/activity/activity/activities.json", // 活动- 合作类型
	_SALE_MAIN_CUSTOMER_TYPE_GET: "/_cms/activity/activity-apply/customer-info.json", // 活动 - 获取客户信息
	_SALE_MAIN_VALID_COMPANIES_GET: "/_cms/activity/activity-apply/valid-companies.json", // 活动 - 获取公司名称
	_SALE_MAIN_ACTIVIOTY_APPLY__RETRAIN_NUM_GET: "/_cms/activity/activity-apply/get-retrain-num.json", // 获取复训次数、合作类别、行业、职位等
	_SALE_MAIN_ACTIVEITY_LIST_GET: "/_cms/activity/activity/month-list.json", // 查看公告里面的近月
	_SALE_MAIN_STATISTICS_CUSTOMER_PAGE_GET: "/_sale/sale/statistics-customer/first-page-statistics.json", // 首页数据统计

	/**
	 * 客户管理
	 */
	SALE_CUSTOMER_INTENTION_GET: "",
	SALE_CUSTOMER_INTENTION_LIST_GET: "/_sale/sale/intention/own-customer-list.json",
	_SALE_CUSTOMER_LIST_SORT_CONFIG_GET: "/_sale/sale/list-sort/list-config.json", // 意向客户；列表配置
	_SALE_CUSTOMER_LIST_SORT_CONFIG_SAVE_POST: '/_sale/sale/list-sort/save-list-config.json', // 意向客户；列表配置保存
	_SALE_INTENTION_INDUSTRY_LIST_GET: "/_sale/sale/intention/industry-list.json", // 行业列表
	_SALE_INTENTION_SCALE_LIST_GET: "/_sale/sale/intention/scale-list.json", // 公司规模
	_SALE_INTENTION_SOURCE_LIST_GET: "/_sale/sale/intention/source-list.json", // 信息来源列表
	_SALE_INTENTION_CHECK_NAME_GET: "/_sale/sale/intention/check-name.json", // 公司名称验证
	_SALE_INTENTION_SAVE_POST: "/_sale/sale/intention/save.json", // 保存客户信息
	_SALE_INTENTION_CHECK_TEL_GET: "/_sale/sale/intention/check-tel.json", // 电话校验
	_SALE_SYSTEM_ADD_SOURCE_POST: "/_sale/sale/system/add-source.json", // 添加信息来源
	_SALE_SYSTEM_DEL_SOURCE_POST: "/_sale/sale/system/del-source.json", // 删除信息来源
	_SALE_INTENTION_UPGRADE_POST: "/_sale/sale/intention/upgrade.json", // 提升客户等级
	_SALE_INTENTION_GET_STAFF_LIST_GET: "/_sale/sale/intention/get-staff-list.json", // 获取员工列表
	_SALE_INTENTION_DISTRIBUTE_POST: "/_sale/sale/intention/distribute.json", // 指派
	_SALE_DEAL_CUSTOMER_ASSIGN_POST: '/_sale/sale/deal-customer/assign.json', // 转单
	_SALE_INTENTION_CONTACT_GET: "/_sale/sale/intention/contact.json", // 获取联系人列表
	_SALE_INTENTION_SAVE_CONTACT_POST: "/_sale/sale/intention/save-contact.json", // 添加，修改联系人
	_SALE_INTENTION_DEL_CONTACT_POST: '/_sale/sale/intention/del-contact.json', // 删除联系人
	_SALE_INTENTION_ADD_SALE_LOG_POST: "/_sale/sale/intention/add-sale-log.json", // 添加销售记录
	_SALE_INTENTION_SHOW_SALE_LOG_GET: "/_sale/sale/intention/show-sale-log.json", // 获取销售记录
	_SALE_INTENTION_INFO_HEAD_GET: "/_sale/sale/intention/info-head.json", // 客户信息头部
	// _SALE_INTENTION_EDIT_CUSTOMER_POST: "/_sale/sale/intention/edit-customer.json", // 编辑客户信息保存
	// _SALE_INTENTION_EDIT_CUSTOMER_COMPANY_POST: "/_sale/sale/intention/edit-customer-company.json", // 编辑客户信息保存
	_SALE_INTENTION_CONTACT_INFO_GET: "/_sale/sale/intention/contact-info.json", // 联系人信息
	_SALE_INTENTION_BACK_SEA_POST: "/_sale/sale/intention/back-sea.json", // 归还公海
	_SALE_INTENTION_DEL_CUSTOMER_POST: "/_sale/sale/intention/del-customer.json", // 删除客户
	_SALE_INTENTION_CUSTOMER_INFO_GET: "/_sale/sale/intention/customer-info.json", // 客户详情
	_SALE_INTENTION_BERORE_UPGRADE_GET: "/_sale/sale/intention/before-upgrade.json", // 客户升级前获取数据
	_SALE_SYSTEM_SMS_VERIFY: '/_sale/sale/system/sms-verify.json', // 验证短信验证码
	_SALE_INTENTION_SET_TOP: "/_sale/sale/intention/set-top.json", // 置顶
	_SALE_DIALING_RECORDING_CALL_RECORD: "/_sale/sale/dialing-recording/get-call-record.json", // 	客户详情-通话记录
	_SALE_SEA_CUSTOMER_LINK_TEL_LIST: '/_sale/sale/sea/get-customer-link-tel.json', // 获取绕前台电话列表
	_SALE_SEA_CUSTOMER_LINK_TEL_ADD: '/_sale/sale/sea/add-customer-link-tel.json', // 添加绕前台电话
	_SALE_INTENTION_SET_OWN_REMIND: '/_sale/sale/intention/set-customer-own-remind.json', // 设置跟进时间提醒
	_SALE_INTENTION_CLEAR_OWN_REMIND_POST: "/_sale/sale/intention/clear-customer-own-remind.json", // 清除跟进提醒
	// _SALE_PAYMENT_STAFF_LIST_GET: "/_sale/sale/payment/get-staff-list.json",
	_SALE_PAYMENT_STAFF_LIST_GET: "/_hr/api/human/get-staff-list-by-search.json", // 下单-获取谈判人列表

	_SALE_INTENTION_CHECK_OWN_REMIND_GET: "/_sale/sale/intention/check-customer-own-remind.json",
	_SALE_SEA_GET_STAFF_FOR_PAYMENT: "/_sale/sale/sea/get-staff-for-payment.json",

	 // 添加客户模块
	_SALE_CUSTOMER_DEAL_CUSTOMER_LIST_GET: "/_sale/sale/customer/deal-customer-list.json", // 获取个人成交公司客户列表
	_SALE_CUSTOMER_CUSTOMER_STATUS_GET: "/_sale/sale/customer/get-customer-status.json", // 解析数据后的客户数据校验
	_SALE_CUSTOMER_ALL_CUSTOMER_INFO_GET: "/_sale/sale/customer/get-all-customer-info.json", // 领取客户详情
	_SALE_CUSTOMER_SAVE_PERSONAL_POST: "/_sale/sale/customer/save-personal.json", // 添加个人客户
	_SALE_CUSTOMER_SAVE_COMPANY_POST: "/_sale/sale/customer/save-company.json", // 添加企业客户
	_SALE_CUSTOMER_CUSTOMER_BASIC_INFO_GET: "/_sale/sale/customer/customer-basic-info.json", // 不受权限，客户状态限制，获取完整的客户信息
	_SALE_SALE_LOG_COMMENT_POST: "/_sale/sale/sale-log/comment.json", // 评论销售记录
	_SALE_CUSTOMER_PUBLIC_INFO_GET: "/_sale/sale/customer/public-customer-info.json", // 意向客户头部信息
	_SALE_CUSTOMET_EDIT_CUSTOMER_TYPE_POST: "/_sale/sale/customer/edit-customer-type.json", // 编辑客户类型
	_SALE_CUSTOMER_EDIT_CUSTOMER_INDUSTRY_POST: "/_sale/sale/customer/edit-customer-industry.json", // 编辑客户行业
	_SALE_CUSTOMER_LINK_DELETE_POST: "/_sale/sale/customer-link-tel/del-customer-link-tel.json",
	_SALE_CUSTOMER_CUSTOMER_TYPE_LIST_GET: "/_sale/sale/system/customer-types.json", // 获取客户类型列表
	_SALE_CUSTOMER_INDUSTRY_TREE_GET: '/_sale/sale/system/industry.json', // 获取行业树结构
	_SALE_CUSTOMER_ROLE_LIST_GET: '/_sale/sale/system/customer-roles.json', // 客户角色列表
	_SALE_CUSTOMER_CUSTOMER_INFO_GET: '/_sale/sale/customer/customer-info.json', // 客户详情获取客户信息
	_SALE_CUSTOMER_SAVE_CUSTOMET_LINK_POST: "/_sale/sale/customer-link-tel/save-customer-link-tel.json", // 保存绕前台数据
	_SALE_CUSTOMER_EDIT_CUSTOMER_COMPANY_POST: "/_sale/sale/customer/edit-customer-company.json", // 编辑企业客户信息
	_SALE_CUSTOMER_EDIT_CUSTOMER_PERSONAL_POST: "/_sale/sale/customer/edit-customer-personal.json", // 编辑个人客户信息
	_SALE_CUSTOMER_DIALING_UPDATE_RECORD_POST: "/_sale/sale/dialing-recording/update-call-in-relation.json", // 外呼-更新通话记录关联信息
	_SALE_CUSTOMER_DEAL_CHANGE_COMPANY_NAME_POST: '/_sale/sale/deal-customer/change-company-name.json',
	SALE_CUSTOMER_INTENTION_DISTRIBUTE_LIST_GET: "/_hr/api/human/get-staff-list-by-search.json", // 指派-获取员工列表

	// 2.2.5
	_SALE_CUSTOMER_SALE_LOG_RECORD_GET: "/_sale/sale/sale-log/get-record.json", // 意向客户-跟进记录获取
	_SALE_CUSTOMER_SALE_LOG_SAVE_POST: "/_sale/sale/sale-log/save.json", // 意向客户-保存跟进记录
	_SALE_CUSTOMER_REPORT_SAVE_POST: "/_sale/sale/report/save.json", // 意向客户-跟进记录，联系方式举报
	_SALE_CUSTOMER_REPORT_DELETE_POST: "/_sale/sale/report/delete.json", // 撤回举报
	SALE_CUSTOMER_AUDIT_MISTAKE_LIST_GET: "/_sale/sale/report/audit-link-list.json", // 错误关联审核 - 列表
	_SALE_CUSTOMER_INTENTION_RELATE_BY_TEL_GET: '/_sale/sale/customer/relate-by-tel.json', // 意向客户-关联客户-号码关联客户
	_SALE_CUSTOMER_INTENTION_RELATE_BY_NAME_GET: '/_sale/sale/customer/relate-by-name.json', // 意向客户-关联客户-公司名关联客户
	_SALE_CUSTOMER_SYSTEM_OTHER_CONFIG_GET: "/_sale/sale/system/get-other-config.json", // 其他设置
	_SAE_CUSTOMER_TURN_RECORD_GET: "/_sale/sale/customer/get-customer-locus.json", // 资料转手记录
	_SALE_CUSTOMER_EDIT_CONFIG_GET: "/_sale/sale/customer-edit-config/get-config.json", // 编辑客户配置
	_SALE_CUSTOMER_LINK_TEL_LINK_RELATION_GET: "/_sale/sale/customer-link-tel/get-call-link-relation.json", // 标记错误联系方式
	_SALE_CUSTOMER_LINK_RELATTION_DELETE_POST: "/_sale/sale/customer-link-tel/del-call-link-relation.json", // 删除联系方式标记
	_SALE_CUSTOMER_RELATE_BY_TEL_FOR_PAYMENT_GET: "/_sale/sale/customer/relate-by-tel-for-payment.json", // 关联客户列表-电话关联（录账用）
	_SALE_CUSTOMER_PROTECT_PROP_INFO_GET: "/_sale/sale/customer-protect/get-prop-info.json", // 延长保护期使用盾牌前获取信息
	_SALE_CUSTOMER_PROTECT_USE_PROP_POST: "/_sale/sale/customer-protect/use-prop.json", // 使用延长保护期盾牌
	_SALE_CUSTOMER_PROTECT_CANCEL_POST: "/_sale/sale/customer-protect/cancel.json", // 撤回延长保护期申请
	_SALE_SEA_CUSTOMER_SURPLUS_GET: "/_sale/sale/sea/get-customer-surplus.json", // 领取前获取剩余领取数量
	_SALE_SEA_CUSTOMER_SURPLUS_PROP_GET: "/_sale/sale/use-prop/prepare-to-use.json", // 领取前获取剩余领取数量-道具中心
	_SALE_CUSTOMER_USE_PROP_POST: "/_sale/sale/use-prop/use-prop.json", // 直接使用120天客户名额券 "prop_type": 5  使用类型 只有值为4或5的时候才可以调用该接口
	_SALE_CUSTOMER_ATTENTION_ADD_POST: "/_sale/sale/attention-customer/add-attention.json", // 添加关注客户
	_SALE_CUSTOMER_SEA_GETCUSTOMER_BY_PROP_POST: "/_sale/sale/sea/get-customer-by-prop.json", // 抢资料

	SALE_CUSTOMER_AUDIT_DELAY_LIST_GET: '/_sale/sale/customer-protect/list.json', // 保护期延长申请列表
	_SALE_CUSTOMER_APPLY_PROTECT_POST: "/_sale/sale/customer-protect/save.json", // 保护期延长申请
	_SALE_CUSTOMER_AUDIT_DELAY_DETAIL_GET: '/_sale/sale/customer-protect/detail.json', // 保护期延长详情
	_SALE_CUSTOMER_AUDIT_DELAY_AUDIT_POST: '/_sale/sale/customer-protect/audit.json', // 保护期延长审核
	_SALE_CUSTOMER_AUDIT_DELAY_SELF_DETAIL_GET: '/_sale/sale/customer-protect/last-detail.json', // 查看个人申请详情

	/**
	 * 成交客户
	 */

	SALE_CUSTOMER_DEAL_ARRIVE_LIST_GET: "/_sale/sale/payment/list.json", // 到账记录列表
	SALE_CUSTOMER_DEAL_CONTRACT_LIST_GET: "/_sale/sale/contract/list.json",
	SALE_CUSTOMER_DEAL_DEAL_LIST_GET: "/_sale/sale/deal-customer/list.json",
	SALE_CUSTOMER_DEAL_REFUND_LIST_GET: "/_sale/sale/refund/list.json",
	SALE_CUSTOMER_DEAL_SUPPLY_LIST_GET: "/_sale/sale/supplement/list.json",
	SALE_CUSTOMER_DEAL_RELATION_LIST_GET: "/_sale/sale/relate-customer/list.json",
	SALE_CUSTOMER_DEAL_RELATION_DETAIL_LIST_GET: "/_sale/sale/relate-customer/customer-list.json", // 关联客户-查看详情-客户详情


	_SALE_CUSTOMER_DEAL_SUPPLY_DELETE_POST: "/_sale/sale/supplement/delete.json",
	// _SALE_PRODUCT_RENEW_LIST_GET: "/_cms/product/product/renew-list.json", // 续费产品列表接口--已废弃
	_SALE_SUPPLEMENT_INFO_GET: "/_sale/sale/supplement/info.json",
	_SALE_PAYMENT_DELETE_POST: "/_sale/sale/payment/delete.json", // 删除到账记录
	_SALE_CONTRACT_DELETE_POST: "/_sale/sale/contract/delete.json", // 删除合同记录
	_SALE_REFUND_DELETE_POST: "/_sale/sale/refund/delete.json", // 删除退款记录
	_SALE_PAYMENT_DETAIL_GET: "/_sale/sale/payment/detail.json", // 到账记录详情
	_SALE_PAYMENT_SAVE_POST: "/_sale/sale/payment/save.json", // 录入到账
	_SALE_PAYMENT_UPDATE_POST: "/_sale/sale/payment/update.json", // 编辑录入到账
	_SALE_RELATE_CUSTOMER_CHECK_POST: "/_sale/sale/relate-customer/check-before-save.json", // 关联客户保存前的验证
	_SALE_RELATE_CUSTOMER_SAVE_POST: "/_sale/sale/relate-customer/save.json", // 保存员工选择的关联客户
	_SALE_RELATE_CUSTOMER_UPDATE_POST: "/_sale/sale/relate-customer/update.json", // 编辑员工选择的关联客户
	_SALE_RELATE_CUSTOMER_AUDIT_POST: "/_sale/sale/relate-customer/audit.json", // 关联客户-审核
	_SALE_RELATE_CUSTOMER_CANCEL_POST: "/_sale/sale/relate-customer/cancel.json", // 关联客户-取消申请
	_SALE_RELATE_CUSTOMER_REVOKE_POST: "/_sale/sale/relate-customer/revoke.json", // 关联客户-撤销审核
	_SALE_RELATE_CUSTOMER_DELETE_POST: "/_sale/sale/relate-customer/delete.json", // 关联客户-删除
	_SALE_RELATE_CUSTOMER_INFO_HEAD_GET: "/_sale/sale/relate-customer/info-head.json", // 关联客户-客户详情-侧弹窗-头部信息
	_SALE_RELATE_CUSTOMER_CUSTOMER_INFO_GET: "/_sale/sale/relate-customer/customer-info.json", // 关联客户-客户详情-侧弹窗-客户信息

	_SALE_SALE_PAYMENT_PAYMENT_METHOD_LIST_GET: "/_sale/sale/payment/payment-method-list.json", // 录入到账 -获取支付方式列表
	_SALE_SALE_PRODUCT_CATEGORY_LIST_GET: "/_cms/product/product-category/get-product-category.json", // 录入到账 -获取产品分类
	_SALE_SALE_DEAL_CUSTOMER_DETAIL_GET: "/_sale/sale/deal-customer/detail.json", // 成交客户-成交客户-客户详情
	_SALE_PAYMENT_OUR_CONTRACT_COMPANY_GET: "/_sale/sale/payment/our-contract-company.json", // 成交客户-到账记录-我方合同公司列表
	_SALE_PAYMENT_RELATION_COMPANY_GET: "/_sale/sale/relate-customer/relation.json", // 到账记录- 关联公司搜索
	_SALE_PAYMENT_RECEIVE_COMPANY_EGT: "/_sale/sale/payment/receive-company.json", // 收款公司
	_SALE_PAYMENT_PROTECT: "/_sale/sale/payment/protect.json", // 获取保护期
	_SALE_CONTRACT_DETAIL_GET: "/_sale/sale/contract/detail.json", // 客户合同查看详情
	_SALE_CONTRACT_PROJECT_GET: "/_sale/sale/contract/project.json", // 客户合同-查看详情-项目需求
	_SALE_CONTRACT_PERFORMANCE_PROJECT_GET: "/_sale/sale/contract/performance-project.json", // 客户合同-查看详情-项目需求
	_SALE_CONTRACT_CUSTOMER_INFO_GET: "/_sale/sale/contract/customer-info.json", // 客户合同-查看详情-客户信息
	_SALE_CONTRACT_ELECTRONIC_GET: "/_sale/sale/contract/electronic.json", // 客户合同-查看详情-电子合同
	_SALE_CONTRACT_SERVICE_AMOUNT_GET: "/_sc/sale/service-amount/get-detail-by-contract.json", // 客户合同-查看详情-服务提成
	_SALE_PROJECT_CAHNGE_RECORD_GET: "/_sale/sale/project/change-record.json", // 客户合同-查看详情-产品更换记录
	_SALE_CONTRATC_OTHER_CONTRACT_GET: "/_sale/sale/contract/other-contract.json", // 客户合同-查看详情-其他合同
	_SALE_CONTRACT_CUSTOMER_BALANCE_GET: "/_sale/sale/contract/get-customer-balance.json", // 下单获取余额
	_SALE_PAYMENT_CUSTOMER_COMPANY: "/_sale/sale/payment/customer-company.json",
	_SALE_RELATE_CUSTOMER_INFO_GET: "/_sale/sale/relate-customer/info.json", // 关联客户-重新编辑、重新申请时调用
	_SALE_RELATE_CUSTOMER_ALL_INFO_GET: "/_sale/sale/relate-customer/all-info.json", // 关联客户-查看详情、审核时调用
	_SALE_RELATE_CUSTOMER_CONTRACT_INFO_GET: "/_sale/sale/relate-customer/customer-company-info.json", // 关联客户-查看详情-客户详情-合同公司信息
	_SALE_CONTRACT_AUDIT_INFO_GET: "/_sale/sale/contract/audit-info.json", // 合同审核信息
	_SALE_CONTRACT_MODIFY_CONTRACT_POST: "/_sale/sale/contract/modify-contract-info.json", // 客户合同-修改合同信息（修改对接人）
	_SALE_URGE_PAYMENT_POST: "/_sale/sale/urge/payment.json", // 到账-催一下
	_SALE_URGE_CONTRACT_POST: "/_sale/sale/urge/contract.json", // 下单-催一下
	_SALE_URGE_CHANGE_PRODUCT_REFUND_POST: "/_sale/sale/urge/change-product-refund.json", // 换产品退款-催一下
	_SALE_CONTRACT_NUM_VALIDATE_GET: "/_sale/sale/contract/validate-contract-num.json", // 下单合同编号验证重复

	_SALE_PRODUCT_LIST_GET: "/_cms/product/product/list.json", // 下单获取产品列表
	_SALE_PRODUCT_DETAIL_GET: "/_sale/sale/product/detail.json", // 下单获取产品详情
	_SALE_CONTRACT_DEPART_STAFF_SEARCH_GET: '/_hr/human/staff/get-staff-pk-by-search.json', // 下单按部门和名称搜索员工列表

	_SALE_CONTRACT_SAVE_POST: "/_sale/sale/contract/save.json", // 下单
	_SALE_CONTRACT_UPDATE_POST: "/_sale/sale/contract/update.json", // 编辑下单
	_SALE_CONTRACT_VALIDATE: "/_sale/sale/contract/validate.json", // 下单第一步验证
	_SALE_DEAL_CUSTOMER_BASIC_COMPANY_INFO_GET: "/_sale/sale/deal-customer/basic-company-info.json", // 下单-获取客户信息
	_SALE_PROJECT_INFO_GET: "/_sale/sale/project/info.json", // 项目详情
	_SALE_PROJECT_SAVE_POST: "/_sale/sale/project/save.json", // 换产品保存
	_SALE_PROJECT_UPDATE_POST: "/sale/project/update.json", // 换产品修改
	_SALE_CONTRACT_INFO_GET: "/_sale/sale/contract/info.json", // 客户详情-下单修改获取历史数据
	_SALE_SALE_CONTRACT_DELETE_POST: "/_sale/sale/contract/delete.json", // 撤回下单
	_SALE_SUPPLEMENT_SAVE_POST: "/_sale/sale/supplement/save.json", // 补交尾款
	_SALE_SUPPLEMENT_UPDATE_POST: "/_sale/sale/supplement/update.json", // 补交尾款
	_SALE_SUPPLEMENT_PROJECT_INFO_GET: "/_sale/sale/supplement/project-info.json", // 补款项目数据
	_SALE_SUPPLEMENT_CONTRACT_CATEGORY: '/_sale/sale/supplement/contract-product-category.json', // 合同产品分类
	_SALE_REFUND_SAVE_POST: "/_sale/sale/refund/save.json", // 各种退款
	_SALE_REFUND_UPDATE_POST: "/_sale/sale/refund/update.json", // 各种退款
	_SALE_CUSTOMER_COMPANY_PAYMENT_LIST: "/_sale/sale/deal-customer/customer-company-payment-list.json", // 退款详情-到账记录
	_SALE_REFUND_PAYMENT_BALANCE_GET: "/_sale/sale/refund/payment-balance.json",
	_SALE_WHITE_LIST_ADD_POST: "/_sale/sale/white-list/add.json", // 添加到白名单
	_SALE_SYSTEM_ADD_CUSTOMER_LABEL_POST: "/_sale/sale/system/add-system-label.json", // 添加系统标签
	_SALE_SYSTEM_DELETE_CUSTOMER_POST: "/_sale/sale/system/delete-system-label.json", // 删除系统标签
	_SALE_SYSTEM_SYSTEM_LABEL_GET: "/_sale/sale/system/system-label.json", // 获取所有系统标签
	_SALE_DEAL_CUSTOMER_LABEL_POST: "/_sale/sale/deal-customer/label.json", // 修改客户标签
	_SALE_CONTRACT_PARENT_CONTRACT_GET: "/_sale/sale/contract/parent-contract.json", // 下单-获取原合同
	_SALE_CONTRACT_ELECTRONIC_SAVE_POST: "/_sale/sale/electronic-contract/save.json", // 客户合同-客户信息-修改电子合同
	_SALE_CONTRACT_DISCOUNT_SAVE_POST: "/_sale/sale/discount-contract/save.json", // 客户合同-客户信息-修改折扣凭证

	_SALE_PAYMENT_VALIDATE_CUSTOMER_COMPANY: "/_sale/sale/payment/validate-customer-company.json", //
	_SALE_CONTRACT_CONTRACT_HAS_AUDIT: "/_sale/sale/contract/contract-has-audit.json", // 验证能否编辑或撤销合同

	_SALE_PAYMENT_HAS_AUDIT_GET: '/_sale/sale/payment/is-audited.json', // 到账记录-检查是否已审核
	_SALE_REFUND_HAS_AUDIT_GET: "/_sale/sale/refund/is-audited.json", // 退款申请-检查是否已审核
	_SALE_SUPPLEMENT_HAS_AUDIT_GET: "/_sale/sale/supplement/is-audited.json", // 补款申请-检查是否已审核
	_SALE_CONTRACT_SERVICE_AMOUNT_CHANGE_RECORD_GET: "/_sc/sale/service-amount/change-record.json", // 合同详情-服务提成变更记录
	_SALE_PAYMENT_PAYMENT_LABEL: "/_sale/sale/payment/payment-label.json", // 录入到账-款项标签list
	_SALE_PAYMET_PAYMENT_SHARE_GET: "/_sale/sale/payment/payment-share.json", // 退款详情--到账详情--获取分单信息

	/**
	 * 业务数据
	 */

	_SALE_BUSINESS_DATA_GET_CONFIG_GET: "/_sale/sale/business-data-sale/get-config.json", //  销售"
	_SALE_BUSINESS_DATA_GET_ASSOCIATE_GET: "/_sale/sale/business-data-sale/associate.json", // 公司名联想
	_SALE_BUSINESS_DATA_GET_SAVE_POST: "/_sale/sale/business-data-sale/save.json", //  添加/编辑数据
	SALE_CUSTOMER_BUSINESS_LIST_GET: "/_sale/sale/business-data-sale/data-list.json",
	SALE_CUSTOMER_BUSINESS_DATA_SUMMARY_GET: "/_sale/sale/business-data-sale/data-summary.json",
	_SALE_BUSINESS_DATA_SAVE_TABLE_CONFIG_POST: "/_sale/sale/business-data-sale/save-table-config.json", //  业务数据-保存表头配置（sale/hr）
	_SALE_BUSINESS_DATA_TABLE_CONFIG_GET: "/_sale/sale/business-data-sale/table-config.json", //  业务数据-查看数据-表头
	_SALE_BUSINESS_DATA_INFO_TABLE_CONFIG_GET: "/_sale/sale/business-data-sale/info-table-config.json", //  业务数据-查看数据-表头
	SALE_CUSTOMER_BUSINESS_CHECK_LIST_GET: "/_sale/sale/business-data-sale/data-summary-list.json", //  业务数据-查看数据查看-列表
	SALE_CUSTOMER_BUSINESS_DETAIL_LIST_GET: "/_sale/sale/business-data-sale/daily-data-list.json", //  业务数据-查看数据-详情-列表
	_SALE_CUSTOMER_BUSINESS_DETAIL_INFO_GET: "/_sale/sale/business-data-sale/daily-data-info.json", // 业务数据-查看-详情-列表-详情
	_SALE_CUSTOMER_BUSINESS_DETAIL_DEL_POST: "/_sale/sale/business-data-sale/daily-data-del.json", //  业务数据-查看-详情-列表-删除
	_SALE_CUSTOMER_BUSINESS_CALL_RECORD_GET: "/_sale/sale/business-data-sale/call-record.json", //  业务数据-添加业务数据获取通话记录
	_SALE_CUSTOMER_BUSINESS_SAVE_MORE_POST: "/_sale/sale/business-data-sale/save-more.json", //  业务数据-添加业务数据获取通话记录








	// 退款记录
	_SAEL_REFUND_DETAIL_GET: "/_sale/sale/refund/detail.json", // 退款信息，头部
	_SALE_REFUND_INFO_GET: "/_sale/sale/refund/refund-info.json", // 退款详情 包括合同退款，换产品，余额退款
	_SALE_REFUND_CONTRACT_INFO_GET: "/_sale/sale/refund/contract-info.json", // 退款记录，款项信息
	_SALE_SUPPLEMENT_CONTRACT_LIST_GET: "/_sale/sale/supplement/contract-list.json", // 成交客户-补交尾款-获取补款合同
	_SALE_REFUND_CANCEL_POST: "/_sale/sale/refund/cancel.json", // 取消退款
	_SALE_REFUND_AUDIT_POST: "/_sale/sale/refund/audit.json", // 退款审核
	_SALE_CONTRACT_SUPPLEMENT_LIST_GET: "/_sale/sale/contract/supplement-list.json",
	_SALE_INTENTION_EXPIR_CUSTOMER: "/_sale/sale/intention/last-day-expiration-customer.json", // 保护时间到期提醒

	// 外呼
	_SALE_DIALING_RECORDING_COMPANY_ASSOCIATE_GET: "/_sale/sale/dialing-recording/company-associate.json", // 查询公司
	_SALE_DIALING_RECORDING_GET_CUSTOMER_INFO_GET: "/_sale/sale/dialing-recording/get-customer-info.json", // 获取客户信息
	_SALE_DIALING__RECORDING_ADD_CALL_RECORD_POST: "/_sale/sale/dialing-recording/add-call-record.json", // 添加通话记录
	_SALE_DIALING_RECORDING_ADD_REMARK_POST: "/_sale/sale/dialing-recording/add-remark.json", // 添加通话备注
	_CMS_API_DOWNLOAD_DOWNLOAD_GET: "/_cms/download/download.json", // 通话记录下载
	_SALE_CALL_ADD_LOG_POST: "/_sale/sale/dialing-recording/add-error.json",
	/**
	 * 公海档案
	 */

	_SALE_SEA_CONFIG_SAVE_POST: "/_sale/sale/system/save.json", // 公海-领取配置数据保存
	_SALE_SEA_CONFIG_DEL_POST: "/_sale/sale/system/del-config.json", // 公海-删除单条领取配置信息
	_SALE_SEA_WHITE_ADD_POST: "/_sale/sale/white-list/add.json", // 添加到白名单
	_SALE_SEA_WHITE_RECOVERY_POST: "/_sale/sale/white-list/recovery.json", // 白名单-恢复
	_SALE_SEA_SAVE_INFO_POST: "/_sale/sale/sea/save-info.json", // 公海信息编辑保存
	_SALE_SEA_GET_CUSTOMER_POST: "/_sale/sale/sea/get-customer.json", // 公海客户领取
	_SALE_SEA_BLACK_MARK_POST: '/_sale/sale/recycle/save.json', // 标记资料
	_SALE_SEA_BLACK_CANCEL_MARK_POST: '/_sale/sale/recycle/cancel.json', // 取消标记
	_SALE_SEA_BLACK_CONFIRM_POST: '/_sale/sale/recycle/confirm.json', // 确认黑名单
	_SALE_SEA_BLACK_RECOVERY_POST: '/_sale/sale/recycle/recovery.json', // 恢复黑名单
	_SALE_SEA_BLACK_DELETE_POST: '/_sale/sale/recycle/delete.json', // 删除黑名单


	_SALE_SEA_CUSTOMER_CONFIG_GET: "/_sale/sale/system/get-customer-config.json", // 公海-领取配置数据
	_SALE_SEA_WHITE_CUSTOMER_INFO_GET: "/_sale/sale/white-list/customer-info.json", // 白名单详情-客户信息
	_SALE_SEA_INFO_HEAD_GET: "/_sale/sale/sea/info-head.json", // 公海-详情-公共头部信息
	_SALE_SEA_WHITE_HEAD_INFO_GET: "/_sale/sale/white-list/info-head.json", // 白名单详情-公共头部
	_SALE_SEA_CUSTOMER_INFO_GET: "/_sale/sale/sea/customer-info.json", // 公海-详情-客户信息
	_SALE_SEA_RECYCLE_DETAIL_GET: "/_sale/sale/recycle/detail.json", // 公海-详情-查看凭证
	_SALE_INDUSTRY_LIST_GET: "/_sale/sale/intention/industry-list.json", // 行业列表
	_SALE_SCALE_LIST_GET: "/_sale/sale/intention/scale-list.json", // 公司规模列表
	_SALE_SEA_CONTACT_LIST_GET: "/_sale/sale/intention/contact.json", // 联系人列表
	_SALE_SALE_RECORD_LIST_GET: "/_sale/sale/intention/show-sale-log.json", // 获取销售记录
	_SALE_SEA_BLACK_TYPE_GET: '/_sale/sale/recycle/type-label.json', // 获取标记原因列表
	_SALE_SEA_ARCHIVE_LIST_CONFIG_GET: "/_sale/sale/list-sort/sea-list-config.json", // 公海档案；列表配置


	SALE_SEA_ARCHIVE_LIST_GET: "/_sale/sale/sea/list.json", // 公海列表
	SALE_SEA_WHITE_LIST_GET: "/_sale/sale/white-list/list.json", // 白名单列表
	SALE_SEA_BLACK_LIST_GET: '/_sale/sale/recycle/list.json', // 黑名单列表

	/**
	 * 每日服务
	 */

	_SALE_SERVICE_SIGN_STAR_POST: "/_sc/sale/sale/sign-star.json", // 标星、取消标星接口
	_SALE_SERVICE_SET_MINEFIELD_POST: "/_sc/sale/sale/set-minefield.json", // 设置/取消雷区
	_SALE_SERVICE_ADD_ITEM_REMIND_POST: "/_sc/sale/remind/add-item-remind.json", // 添加/编辑服务项提醒
	_SALE_SERVICE_SUBMIT_RECORD_POST: "/_sc/sale/stage/submit-service-record.json", // 提交服务凭证
	_SALE_SERVICE_ADD_CUSTOM_POST: "/_sc/sale/stage/add-custom-item.json", // 添加自定义服务项
	_SALE_SERVICE_DEL_CUSTOM_POST: "/_sc/sale/stage/delete-customer-item.json", // 删除自定义服务项
	_SALE_SERVICE_APPLY_POST: "/_sc/sale/apply/service-apply.json", // 发起开启 /暂停服务申请
	_SALE_SERVICE_SUBMIT_INTEGRAL_POST: '/_sc/sale/sale/integral-index.json', // 提交积分指标
	_SALE_SERVICE_STOP_APPLY_POST: "/_sc/sale/apply/stop-service-apply.json", // 申请暂停服务
	_SALE_SERVICE_OPEN_APPLY_POST: "/_sc/sale/sale/open-service.json", // 开启服务
	_SALE_SERVICE_STOP_POST: "/_sc/sale/apply/stop-service.json", // 申请暂停服务（服务人是总监或者超管）
	_SALE_SERVICE_APPLY_CANCEL_POST: "/_sc/sale/apply/cancel-apply.json", // 撤回申请
	_SALE_SERVICE_AUDIT_POST: "/_sc/sale/apply/audit-service.json", // 审核服务申请
	_SALE_SERVICE_CLOSE_SET_APPLY_POST: "/_sc/sale/apply/close-set-apply.json", // 服务项关闭申请
	_SALE_SERVICE_ADD_QUALITY_FOLLOW_POST: "/_sc/sale/feedback/add-quality-follow.json", // 添加/编辑跟进
	_SALE_SERVICE_CANCEL_FOLLOW_POST: "/_sc/sale/feedback/cancel-follow.json", // 撤销跟进
	_SALE_SERVICE_AMOUNT_APPEAL_POST: "/_sc/sale/apply/service-amount-appeal.json", // 服务提成申诉申请
	_SALE_SERVICE_CANCEL_RECORD_POST: "/_sc/sale/stage/cancel-service-record.json", // 撤销提交服务
	_SALE_SERVICE_OPEN_ITEM_POST: "/_sc/sale/stage/open-service-item.json", // 做服务-开启服务项
	_SALE_SERVICE_REQUIRED_AGAIN_VISIT_POST: "/_sc/sale/feedback/required-again-visit.json", // 要求重新回访
	_SALE_SERVICE_STAGE_CHECK_INTEGRAL_POST: "/_sc/sale/stage/check-integral.json", // 检查积分是否到达上限


	_SALE_SERVICE_CUSTOMER_INFO_GET: "/_sc/sale/sale/service-customer-info.json", // 服务的客户信息
	_SALE_SERVICE_PRODUCT_PROGRESS_GET: "/_sc/sale/sale/product-process.json", // 产品制作进度
	_SALE_SERVICE_RECORD_GET: "/_sc/sale/sale/service-record.json", // 服务记录
	_SALE_SERVICE_RECORD_LIST_GET: "/_sc/sale/stage/service-record-list.json", // 提交记录列表
	_SALE_SERVICE_SET_GET: "/_sc/sale/stage/get-service-set.json", // 获取服务项设置
	_SALE_SERVICE_CUSTOMER_SERVICE_GET: "/_sc/sale/stage/customer-service.json", // 做服务-客户服务
	_SALE_SERVICE_STRATEGY_GET: "/_sc/sale/stage/get-strategy.json", // 查看服务项攻略
	_SALE_SERVICE_APPLY_GET: "/_sc/sale/apply/get-service-apply.json", // 申请暂停服务获取审核流程
	_SALE_APPLY_SERVICE_DETAIL_GET: "/_sc/sale/apply/get-apply-service-detail.json", // 获取审核详情
	_SALE_SERVICE_ITEM_APPLY_GET: "/_sc/sale/apply/get-service-item-apply.json", // 获取关闭服务项审核流程
	_SALE_SERVICE_AMOUNT_DETAIL_GET: "/_sc/sale/service-amount/details.json", // 服务提成详情
	_SALE_SERVICE_AMOUNT_CHANGE_RECORD_GET: "/_sc/sale/service-amount/change-record.json", // 服务提成变更记录
	_SALE_SERVICE_QUALITY_RECORD_GET: "/_sc/sale/feedback/quality-record.json", // 质检跟进
	_SALE_SERVICE_INTEGRAL_INDEX_DETAIL_GET: "/_sc/sale/feedback/integral-index-detail.json", // 积分指标详情
	_SALE_SERVICE_COMPLAINT_LIST_GET: "/_sc/sale/feedback/complaint-list.json", // 投诉信息列表
	_SALE_SERVICE_APPEAL_DETAIL_GET: "/_sc/sale/apply/get-service-amount-appeal.json", // 获取服务提成申诉详情
	_SALE_SERVICE_RECORD_DETAIL_GET: "/_sc/sale/stage/service-record-detail.json", // 获取提交的服务凭证详情
	_SALE_SERVICE_DAILY_REMIND_GET: "/_sc/sale/sale/daily-service-remind.json", // 每日提醒接口


	SALE_SERVICE_CUSTOMER_LIST_GET: "/_sc/sale/sale/service-list.json", // 客户服务列表
	SALE_SERVICE_CUSTOMER_APPLICATION_LIST_GET: "/_sc/sale/apply/get-apply-list.json", // 服务申请列表
	/**
	 * 实时业绩
	 */
	SALE_ACHIEVEMENT_GET: "",
	SALE_ACHIEVEMENT_LIST_GET: "/_finance/finance/commission/staff.json", // 实时业绩-管理层
	_SALE_ACHIEVEMENT_SUMMARY_GET: "/_sale/sale/achievement/summary.json", // 实时业绩-8个数
	SALE_ACHIEVEMENT_STAFF_GET: "",
	SALE_ACHIEVEMENT_STAFF_LIST_GET: "/_finance/finance/commission/all-list.json", // 实施业绩
	_SALE_ACHIEVEMENT_STAFF_PK_RECORD_GET: "/_finance/finance/bs-commission/performance-change-record.json", // 实施业绩
	_SALE_ACHIEVEMENT_STAFF_COMMISSION_DETAIL_BASIC_GET: "/_finance/finance/bs-commission/commission-detail-basic.json", // 提成明细
	_SALE_ACHIEVEMENT_STAFF_COMMISSION_DETAIL_GET: "/_finance/finance/bs-commission/commission-detail.json", // 提成明细

	/**
	 * 工具包(服务、销售)
	 */

	TOOLKIT_COLLECTION_POST: "/_cms/toolkit/kit-collection/create.json", // 工具包 - 收藏
	TOOLKIT_CANCEL_COLLECTION_POST: "/_cms/toolkit/kit-collection/del.json", // 工具包 - 取消收藏
	TOOLKIT_VIEW_POST: "/_cms/toolkit/kit-material/view.json", // 工具包 - 浏览详情
	TOOLKIT_DOWNLOAD_WARNING_POST: "/_cms/download/warning-rule/limit-notice.json", // 预警提醒


	TOOLKIT_NEW_LIST_GET: "/_cms/toolkit/kit-material/new-list.json", // 最新文档
	TOOLKIT_COLLECTION_LIST_GET: "/_cms/toolkit/kit-collection/list.json", // 我的收藏
	TOOLKIT_BROWSE_LIST_GET: "/_cms/toolkit/kit-browse/list.json", // 最近浏览
	TOOLKIT_CATEGORY_GET: "/_cms/toolkit/kit-category/all.json", // 工具包 - 分类树
	TOOLKIT_FILE_LIST_GET: "/_cms/toolkit/kit-material/file-list.json", // 工具包素材列表
	TOOLKIT_CATEGORY_LIST_GET: "/_cms/toolkit/kit-material/category-list.json", // 工具包-获取子目录数据
	TOOLKIT_DOWNLOAD_GET: "/_cms/download/download.json", // 工具包 - 批量下载

	/**
	 * 开票申请
	 */
	SALE_TICKET_GET: "",
	SALE_TICKET_LIST_GET: "/_sale/sale/invoice/list.json", // 开票申请列表
	_SALE_TICKET_INVOICE_DETAIL_GET: "/_sale/sale/invoice/detail.json", // 开票申请详情
	_SALE_TICKET_INVOICE_CREATE_POST: "/_sale/sale/invoice/create-and-edit.json", // 开票申请创建
	_SALE_TICKET_COMPANY_NAME_GET: "/_sale/sale/invoice/customer-company-by-name.json", // 模糊查询公司抬头
	_SALE_TICKET_CONTRACT_Id_GET: "/_sale/sale/invoice/contract-by-contract-company-id.json", // 模糊查询公司抬头
	_SALE_TICKET_DEL_INVOICE_GET: "/_sale/sale/invoice/del-invoice.json", // 发票删除


	/**
	 * PK相关
	 */
	_SALE_MAIN_PK_SURPLUS_GET: "/_notice/pk/pk/surplus.json", // 本月pk剩余人数
	_SALE_MAIN_PK_STAFF_IDENTIFY_GET: "/_hr/api/human/get-staff-identity.json", // 员工类型  经理|员工
	_SALE_MAIN_PK_START_PK_POST: "/_notice/pk/pk/scene.json", // 开启PK
	_SALE_MAIN_PK_STATUS_GET: "/_notice/pk/pk/get-pk-status.json", // PK 状态
	_SALE_MAIN_PK_TOGGLE_PK_POST: "/_notice/pk/pk/pk-switch.json", // 开启关闭PK
	_SALE_MAIN_PK_FULL_SCREEN_DATA_GET: "/_notice/pk/pk/screen.json", // PK大屏数据
	_SALE_MAIN_PK_QRCODE: "/_notice/pk/pk/pk-qrcode.json", // 二维码
	_SALE_MAIN_PK_STAFF_GET: '/_hr/human/staff/get-staff-pk-by-search.json', // 获取营销部人员
	_SALE_MAIN_PK_EXPORT: '/_notice/pk/pk/export-pk.json',

	_SALE_MAIN_PK_DELETE_POST: '/_notice/pk/pk/delete-record.json', // 删除PK
	// _SALE_MAIN_PK_SOCKET_GET: '/_notice/notice/socket/bind.json?bind_type=2', // socket url 改为_COMMON_SOCKET_BIND_GET
	SALE_MAIN_PK_GET: "",
	SALE_MAIN_PK_STAFF_AND_DEPARTMENT_GET: "/_notice/pk/pk/pk-list.json",
	SALE_MAIN_PK_STATISTIC_GET: "/pk/pk/statistic.json",
	SALE_MAIN_PK_STAFF_LIST_GET: "/_notice/pk/pk/pk-list.json", // PK 首页员工列表数据
	SALE_MAIN_PK_DEPARTMENT_GET: "",
	SALE_MAIN_PK_DEPARTMENT_LIST_GET: "/_notice/pk/pk/pk-list.json", // PK 首页部门列表数据
	SALE_MAIN_PK_STATISTIC_LIST_GET: "/_notice/pk/pk/statistic.json", // PK统计
	_SALE_MAIN_PK_IMPORT_DATA_POST: "/_notice/pk/pk/import-performance.json", // 导入pk数据
	SALE_SERVICE_FIRST_DO_GET: "",
	SALE_SERVICE_CUSTOMER_DO_GET: "",
	SALE_TICKET_APPLY_GET: "",

	/**
	 * 互动大屏
	 */
	SALE_MAIN_SCENE_GET: "/_cms/notice/interact-screen/interact-list.json", // 互动大屏 列表数据 经过 vuex
	_SALE_MAIN_SCREEN_PRAISE_POST: '/_cms/notice/interact-screen/praise-do.json', // 点赞
	_SALE_MAIN_SCREEN_COLLECT_POST: '/_cms/notice/interact-screen/collect-do.json', // 收藏
	_SALE_MAIN_SCREEN_COLLECT_LIST_GET: '/_cms/notice/interact-screen/collect-list.json', // 获取收藏列表
	_SALE_MAIN_SCENE_GET: '/_cms/notice/interact-screen/interact-list.json', // 互动大屏 列表数据 不经过 vuex
	_SALE_MAIN_SCREEN_WITHDRAW_POST: '/_cms/notice/interact-screen/recall.json', // 消息撤回
	// SALE_MAIN_SCREEN_MESSAGE_SOCKET: '/_notice/notice/socket/bind.json?bind_type=1',  改为_COMMON_SOCKET_BIND_GET
	SALE_CUSTOMER_DEAL_DEAL_DETAIL_GET: "",
	SALE_CUSTOMER_DEAL_DEAL_DETAIL_LIST1_GET: "/_sale/sale/deal-customer/payment-list.json",
	SALE_CUSTOMER_DEAL_DEAL_DETAIL_LIST2_GET: "/_sale/sale/deal-customer/contract-list.json",
	SALE_CUSTOMER_DEAL_DEAL_DETAIL_LIST3_GET: "/_sale/sale/deal-customer/refund-list.json",
	SALE_CUSTOMER_DEAL_DEAL_DETAIL_LIST4_GET: "/_sale/sale/deal-customer/customer-list.json", // todo
	SALE_FULL_INFORMATION_GET: "",
	SALE_FULL_INFORMDETAIL_GET: "",
	SALE_FULL_CASEDETAIL_GET: "",
	SALE_CALL_MANAGE_GET: "",
	SALE_CALL_MANAGE_LIST_GET: "/list",
	SALE_CALL_RECORD_GET: "",
	SALE_CALL_RECORD_LIST_GET: '/_sale/sale/dialing-recording/list.json',
	SALE_FULL_GOODS_GET: '/_cms/product/product/sale-product.json',
	/**
	 * 互动大屏
	 */
	SALE_NEWUSER_GET: '',

	/**
	 * 互荐表
	 */
	_HR_PERSONNEL_INFO_RECOMMEND_CONF_ADD_POST: '/_hr/train/recommend-conf/add-recommend-info.json', // 填写互荐表
	_HR_PERSONNEL_INFO_CHECK_RECOMMEND_STAFF_POST: "/_hr/train/recommend-conf/check-recommend-staff.json", // 销售-互荐表填写-判断被评人是否符合条件


	_HR_PERSONNEL_INFO_RECOMMEND_CONF_GET: '/_hr/train/recommend-conf/recommend-info-detail.json', // 销售-互荐表详情
	/**
	 * 心态跟踪
	 */
	_HR_PERSONNEL_INFO_TRACK_POST: '/_hr/applicant/school/say.json', // 心态跟踪

	/**
	 * 添加需求职位
	 */
	_HR_EMPLOYEE_SUMMARY_NEED_ADD_POST: '/_hr/train/need-position/add.json', // 新增编辑添加需求职位

	_HR_EMPLOYEE_SUMMARY_NEED_DETAIL_GET: '/_hr/train/need-position/detail.json', // 需求职位详情
	_HR_EMPLOYEE_SUMMARY_DEPART_IDS_GET: '/_hr/api/human/get-depart-ids-by-depart-id.json', // 根据部门id查找当前部门到一级部门的部门id数组


	HR_PERSONNEL_INFO_DEMAND_LIST_GET: '/_hr/train/need-position/list.json', // 添加需求职位-列表

	/**
	 * 三立培训
	 */
	_SALE_TRAIN_STAFF_EXAM_SAVE_POST: "/_train/sale/staff-exam/save.json", // 答题-提交试卷
	_SALE_TRAIN_EMPLOYEE_DETAIL_GET: "/_train/sale/staff-study/detail.json", // 员工学习记录-详情
	_SALE_TRAIN_EMPLOYEE_PRE_TRAIN_GET: "/_train/sale/staff-study/pre-train.json", // 员工学习记录-详情-岗前培训
	_SALE_TRAIN_EMPLOYEE_TRAIN_ECHELON_GET: "/_train/sale/staff-study/talent-echelon.json", // 员工学习记录-详情-人才计划
	_SALE_TRAIN_EMPLOYEE_OTHER_PROJECT_GET: "/_train/sale/staff-study/other-project.json", // 员工学习记录-详情-其他项目
	_SALE_TRAIN_EMPLOYEE_SELF_STUDY_GET: "/_train/sale/staff-study/self-study.json", // 员工学习记录-详情-自学课程
	_SALE_TRAIN_STAFF_EXAM_DETAIL_GET: "/_train/sale/staff-exam/detail.json", // 答题-试卷详情
	_SALE_TRAIN_STAFF_EXAM_ANSWER_DETAIL_GET: "/_train/sale/staff-exam/answer-detail.json", // 答题-答题详情
	SALE_TRAIN_EMPLOYEE_LIST_GET: '/_train/sale/course-record/staff-study.json', // 员工学习记录
	SALE_TRAIN_EMPLOYEE_COURSE_LIST_GET: "/_train/sale/staff-study/echelon-course-list.json", // 员工学习记录-详情-计划课程查看
	_SALE_TRAIN_EMPLOYEE_COURSE_APPLY_AGAIN_GET: "/_train/sale/staff-exam/apply-again.json", // 重新申请
	_SALE_TRAIN_EXAM_SAVE_QUESTION_POST: "/_train/sale/question/save.json", // 保存我要出题
	_SALE_TRAIN_EXAM_UPDATE_QUESTION_POST: "/_train/sale/question/update.json", // 编辑我要出题
	_SALE_TRAIN_EXAM_APPLY_AGAIN_QUESTION_POST: "/_train/sale/question/save.json", //  重新申请
	_SALE_TRAIN_EXAM_QUESTION_DELETE_POST: '/_train/sale/question/delete.json', // 删除题目
	_SALE_TRAIN_EXAM_QUESTION_CANCEL_POST: '/_train/sale/question/question-cancel.json', // 我要出题-撤回申请
	_SALE_TRAIN_EXAM_QUESTION_DETAIL_GET: '/_train/sale/question/detail.json', // 题目详情
	_SALE_TRAIN_PROJECT_SEARCH_GET: "/_train/train/project/search.json", // 项目搜索下拉框


	_SALE_TRAIN_EXAM_STAFF_EXAM_AUDIT_CANCEL_POST: "/_train/sale/staff-exam-audit/cancel.json", //  凭证列表-撤回凭证
	_SALE_TRAIN_EXAM_STAFF_EXAM_AUDIT_AGAIN_POST: "/_train/sale/staff-exam-audit/update.json", //  凭证列表-撤回凭证
	_SALE_TRAIN_EXAM_STAFF_EXAM_AUDIT_DELETE_POST: "/_train/sale/staff-exam-audit/delete.json", //  凭证列表-撤回凭证
	_SALE_TRAIN_EXAM_STAFF_EXAM_AUDIT_UPDATE_POST: '/_train/sale/staff-exam/update-audit.json', // 上传凭证





	/**
	 * 三立学府
	 */
	SALE_TRAIN_STUDY_LIST_GET: '/_train/sale/course-record/list.json', // 课程记录
	_SALE_TRAIN_STUDY_LIST_DELETE_GET: '/_train/sale/course-record/delete.json', // 课程记录删除

	_SALE_TRAIN_STUDY_ONLINE_STUDY_GET: '/_train/sale/online-study/course-list.json', // 线上学习
	_SALE_TRAIN_EXAM_VOUCHER_DETAIL_GET: '/_train/sale/course-record/get-examination-voucher.json', // 获取凭证信息
	_SALE_TRAIN_ONLINE_SAVE_GET: '/_train/sale/online-study/save.json', // 保存进度线上学习
	_SALE_TRAIN_COURSE_RECORD_SIGN_GET: '/_train/sale/course-record/sign-up.json', // 报名


	_SALE_TRAIN_STUDY_ONLINE_DETAIL_GET: '/_train/sale/online-study/detail.json', // 线上学习-当前学习课程详情
	_SALE_TRAIN_COURSE_SCHEDULE_GET: '/_train/train/schedule/schedule.json', // 三立培训课程表
	SALE_TRAIN_COURSE_DETAIL_LIST_GET: '/_train/sale/course-record/course-arrangement.json', // 学员报名详情列表
	_SALE_TRAIN_COURSE_SCHEDULE_DAY_GET: '/_train/sale/schedule/day-schedule.json', // 三立培训课程表 选择当天
	SALE_TRAIN_STUDY_EXAMINE_LIST_GET: '/_train/sale/staff-exam-audit/list.json', // 查看凭证考试列表
	SALE_TRAIN_STUDY_AUDIT_LIST_GET: '/_train/sale/question/list.json', // 出题列表
	_SALE_TRAIN_EXAM_SUBMIT_AUDIT_POST: '/_train/sale/course-record/upload-examination-voucher.json', // 上传凭证
	_SALE_TRAIN_COURSE_SCHEDULE_APPLY_POST: '/_train/sale/apply/save.json', // 三立培训课程表 我要报名
	_SALE_TRAIN_STUDY_STAFF_DETAIL_GET: "/_train/sale/course-record/detail.json", //  业务数据-查看-详情
	_SALE_TRAIN_STUDY_COURSE_MATERIAL_ELECTIVE_POST: "/_train/sale/course-record/material-elective.json", //  业务数据-查看-详情-列表-删除
	_SALE_TRAIN_STUDY_INDIVIDUAL_LIST_POST: "/_train/train/individual-list/save.json", //  保存用户的设置
	_SALE_TRAIN_STUDY_INDIVIDUAL_DEFAULT_FIELD_GET: "/_train/train/individual-list/default-field.json", //  保存用户的设置
	_SALE_TRAIN_COURSE_DETAIL_RECORD_EDIT_POST: '/_train/sale/apply/update.json', // 重新编辑
	_SALE_TRAIN_COURSE_DETAIL_DELETE_POST: '/_train/sale/apply-record/delete.json', // 删除
	_SALE_TRAIN_COURSE_DETAIL_CANCEL_POST: '/_train/sale/course-record/cancel-sign-up.json', // 撤回申请
	_SALE_TRAIN_COURSE_DETAIL_GET: '/_train/sale/apply-record/detail.json', // 查看申请
	_SALE_TRAIN_EXAM_AUDIT_DETAIL_GET: '/_train/sale/staff-exam-audit/detail.json', // 查看凭证详情






	/**
	 * 私海
	 */
	SALE_CUSTOMER_INTENTION_PRIVATE_GET: '',
	SALE_CUSTOMER_INTENTION_PRIVATE_LIST_GET: '/_sale/sale/private-sea/import-list.json', // 私海列表
	_SALE_CUSTOMER_INTENTION_PRIVATE_SIGN: "/_sale/sale/private-sea/get-customer.json", // 私海客户领取
	_SALE_INTENTION_PRIVATE_IMPORT: "/_sale/sale/private-sea/import.json", // 导入查询
	_SALE_INTENTION_PRIVATE_REIMPORT: "/_sale/sale/private-sea/update-import.json", // 重新匹配
	_SALE_INTENTION_PRIVATE_CHECK_GET_INFO: "/_sale/sale/private-sea/check-before-get-info.json", // 领取前检查
	_SALE_INTENTION_PRIVATE_UPDATE_LIST_GET: "/_sale/sale/private-sea/update-list-status.json", // 进入私海时更新列表
	_SALE_PAYMENT_PRODUCT_EDIT_POST: "/_sc/center/assign-make/product-edit.json", // 到账记录修改产品
	_SALE_INTENTION_PRIVATE_CHECK_BEFORE_IMPORT_GET: '/_sale/sale/private-sea/check-by-self.json', // 导入/重新查询之前检查
	_SALE_INTENTION_PRIVATE_STOP_IMPORT_GET: '/_sale/sale/private-sea/halt-task-import.json', // 强制停止导入查询任务
	_SALE_INTENTION_PRIVATE_STOP_REIMPORT_GET: '/_sale/sale/private-sea/halt-task-update.json', // 强制停止重新查询任务



	/**
	 * 积分学分
	 */
	_SALE_TRAIN_CREDIT_SAVE_APPLY_POST: "/_hr/train/credit/save-apply.json", // 学分申请-新增、修改--销售
	_SALE_TRAIN_CREDIT_WITHDRAW_POST: "/_hr/train/credit/withdraw.json", // 学分申请-撤回申请--销售


	_SALE_TRAIN_INTEGRAL_STAFF_INFO_GET: "/_hr/train/integral/ic-staff-info.json", // 积分学分个人详情-个人信息
	_SALE_TRAIN_INTEGRAL_DETAIL_GET: "/_hr/train/integral/detail.json", // 积分学分个人详情
	_SALE_TRAIN_INTEGRAL_POINT_DETAIL_GET: "/_hr/train/integral/point-detail.json", // 积分学分个人详情-下面的得分详情
	_SALE_TRAIN_INTEGRAL_TAB_GET: "/_hr/train/integral/get-tab.json", // 积分学分-体系列表的tab
	_SALE_TRAIN_INTEGRAL_TABS_BY_YEAR_GET: "/_hr/train/integral/get-types-by-year.json", // 积分学分-列表第一行的自定义类型tab
	_SALE_TRAIN_CREDIT_APPLY_TYPES_GET: "/_hr/train/credit/get-apply-types.json", // 学分申请弹窗的下拉框--销售页面


	SALE_FRACTION_INTEGRAL_SUB_LIST_GET: "/_hr/train/integral/ic-list.json", // 积分-列表
	SALE_FRACTION_CREDIT_SUB_LIST_GET: "/_hr/train/integral/ic-list.json", // 学分-列表
	SALE_FRACTION_CREDIT_APPLICATION_LIST_GET: "/_hr/train/credit/apply-list.json", // 学分申请列表--销售页面
	/**
	 * 素材库  销售板块
	 */
	// _SALE_LIBRARY_MATERIAL_SAVE_POST: "/_cms/library/library-material/sale-material-save.json", // 素材 - 上传文件
	// _SALE_LIBRARY_MATERIAL_FOLDER_SAVE_POST: "/_cms/library/library-material/sale-folder-save.json", // 素材 - 上传/编辑 文件夹
	// _SALE_LIBRARY_COLLECTION_CREATE_POST: "/_cms/library/library-collection/create.json", // 素材 - 添加收藏
	// _SALE_LIBRARY_COLLECTION_CANCEL_POST: "/_cms/library/library-collection/cancel.json", // 素材 - 取消收藏
	// _SALE_LIBRARY_ELECTIVE_CREATE_AND_CANCEL_POST: "/_cms/library/library-elective/create-and-cancel.json", // 素材 - 加入/移出我的选修
	// _SALE_LIBRARY_APPLY_CREATE_POST: "/_cms/library/library-apply/create-apply.json", // 申请查看- 申请（或重新提交）
	// _SALE_LIBRARY_APPLY_EDIT_POST: "/_cms/library/library-apply/edit.json", // 申请查看 - 重新编辑
	// _SALE_LIBRARY_APPLY_AUDIT_POST: "/_cms/library/library-apply/sale-apply-audit.json", // 申请查看 - 审核通过/驳回
	// _SALE_LIBRARY_APPLY_CANCEL_POST: "/_cms/library/library-apply/sale-apply-cancel.json", // 申请查看 - 撤回
	// _SALE_LIBRARY_MATERIAL_REEDIT_POST: "/_cms/library/library-material/reedit.json", // 上传素材 - 重新编辑
	// _SALE_LIBRARY_MATERIAL_RSUBMIT_POST: "/_cms/library/library-material/resubmit.json", // 上传素材 - 重新提交
	// _SALE_LIBRARY_MATERIAL_CANCEL_POST: "/_cms/library/library-material/cancel.json", // 上传素材 - 撤回
	// _SALE_LIBRARY_DOWNLOAD_CREATE_POST: "/_cms/library/library-download/create.json", // 素材 - 新增下载记录
	// _SALE_LIBRARY_DOWNLOAD_SUCCESS_POST: "/_cms/library/library-material/upload-success.json", // 前端上传文件成功-保存素材地址
	// _SALE_LIBRARY_BROWSE_CREATE_POST: "/_cms/library/library-browse/create.json", // 素材 - 添加最近浏览


	// _SALE_LIBRARY_CATEGORY_ALL_GET: "/_cms/library/library-category/all.json", // 类目树 2.2.3
	// _SALE_LIBRARY_MATERIAL_LIST_GET: "/_cms/library/library-material/file-list.json", // 素材 - 列表
	// _SALE_LIBRARY_MATERIAL_NEW_LIST_GET: "/_cms/library/library-material/new-list.json", // 素材 - 最新文档
	// _SALE_LIBRARY_COLLECTION_LIST_GET: "/_cms/library/library-collection/list.json", // 素材 - 我的收藏列表
	// _SALE_LIBRARY_ELECTIVE_LIST_GET: "/_cms/library/library-elective/list.json", // 素材 - 我的选修列表
	// _SALE_LIBRARY_BROWSE_LIST_GET: "/_cms/library/library-browse/list.json", // 素材 - 最近浏览
	// _SALE_LIBRARY_MATERIAL_USE_GET: "/_cms/library/library-material/material-use.json", // 获取素材用途
	// _SALE_LIBRARY_MATERIAL_TYPE_GET: "/_cms/library/library-material/material-type.json", // 素材 - 获取素材类型
	// _SALE_LIBRARY_MATERIAL_DETAIL_GET: "_cms/library/library-material/detail.json", // 素材 - 素材详情 2.2.3
	// _SALE_LIBRARY_MATERIAL_TAPE_DATA_GET: "/_cms/library/library-material-tape/get-tape-data.json", // 录音表单 - 获取相关数据
	// _SALE_LIBRARY_MATERIAL_TAPE_DETAIL_GET: "/_cms/library/library-material-tape/sale-tape-detail.json", // 素材 - 录音表单详情
	// _SALE_LIBRARY_MATERIAL_CAN_LOOK_GET: "/_cms/library/library-material/can-look.json", // 素材 - 判断是否可看素材
	// _SALE_LIBRARY_APPLY_AUDIT_DETAIL_GET: "/_cms/library/library-apply/sale-audit-detail.json", // 申请查看 - 查看审核流程
	// _SALE_LIBRARY_FOLDER_ALL_FILE_GET: "/_cms/library/library-folder/get-all-file.json", // 素材 - 获取文件夹下所有文件
	// _SALE_LIBRARY_CATEGORY_LIST_GET: "/_cms/library/library-material/category-list.json", // 素材列表 - 获取子类目数据


	// SALE_FRACTION_MATERIAL_APPLICATION_LIST_GET: "/_cms/library/library-apply/apply-audit-list.json", // 素材 - 我的申请/我的审核
	// SALE_FRACTION_MATERIAL_UPLOAD_LIST_GET: "/_cms/library/library-material/upload-list.json", // 上传素材 - 列表
	// SALE_FRACTION_MATERIAL_UPLOAD_MY_LIST_GET: "/_cms/library/library-material/my-material-list.json", // 上传素材 - 我的素材列表

	// 2.2.3
	_SALE_LIBRARY_CATEGORY_ALL_GET: "/_cms/library/library-category/all.json", // 自习室-类目树
	_SALE_LIBRARY_MATERIAL_DETAIL_GET: "/_cms/library/library-material/detail.json", // 自习室 - 素材详情
	_SALE_LIBRARY_MATERIAL_LIST_GET: "/_cms/library/library-material/file-list.json", // 自习室 - 列表
	_SALE_LIBRARY_BROWSE_LIST_GET: "/_cms/library/library-browse/list.json", // 自习室 - 最近浏览列表
	_SALE_LIBRARY_BROWSE_CREATE_POST: "/_cms/library/library-browse/create.json", // 自习室 - 添加最近浏览
	// _SALE_LIBRARY_FOLDER_PREVIEW_GET: '/_cms/library/library-folder/folder-preview.json', // 自习室 - 文件夹预览
	_SALE_LIBRARY_FOLDER_CONTENT_GET: "/_cms/library/library-folder/get-folder-content.json", // 素材 - 获取指定文件夹下的内容
	_CMS_TOOLKIT_KIT_FOLDER_CONTENT_GET: "/_cms/toolkit/kit-folder/get-folder-content.json", // 工具包 - 获取指定文件夹下的内容

	// _SALE_LIBRARY_CATEGORY_LIST_GET: '/_cms/library/library-material/category-list.json', // 自习室 - 获取子类目数据
	// _SALE_KITLIBRARY_CATEGORY_LIST_GET: '/_cms/toolkit/kit-material/category-list.json', // 工具包 - 获取子类目数据


	/**
	 * 财务申诉审核
	 */
	FINANCE_CUSTOMER_COMPLAIN_LIST_GET: "/_sc/sale/apply/finance-get-appeal-list.json", // 财务申诉审核,
	SALE_CUSTOMER_DEAL_RELATION_GET: '',
	SALE_CUSTOMER_INTENTION_RECORD_SUCCESS_GET: '',
	SALE_MAIN_SERVICE_GET: '',
	SALE_MAIN_SERVICE_LIST_GET: '/_sc/center/quality-static/sale-company-quality-list.json',
	_SALE_MAIN_SERVICE_SCORE_GET: '/_sc/center/quality-static/sale-company-service-score.json',
	
	SALE_CUSTOMER_INTENTION_TEST_GET: '',

	/**
	 * 道具管理
	 */
	_SALE_PROPERTY_LIST_GET: "/_cms/prop/prop/prop-type.json", // 道具列表
	_SALE_PROPERTY_CENTER_LIST_GET: "/_cms/prop/prop/props.json", // 道具中心列表
	_SALE_PROPERTY_CENTER_PROPERTY_BUY_POST: "/_cms/prop/prop/buy.json", // 道具购买
	_SALE_PROPERTY_CENTER_PROPERTY_DETAIL_GET: "/_cms/prop/prop/detail.json", // 道具详情
	SALE_PROPERTY_MINE_LIST_GET: '/_cms/prop/prop/my-prop.json', // 我的道具列表
	_SALE_PROPERTY_MINE_LIST_GET: '/_sale/sale/use-prop/use-record.json', // 我的道具列表
	_SALE_PROPERTY_CONTROL_TITLE_POST: "/_cms/prop/prop-setting/title.json", // 获取道具功效

	SALE_PROPERTY_CONTROL_LIST_GET: '/_cms/prop/prop/list.json', // 道具管理列表
	_SALE_PROPERTY_CONTROL_PROPERTY_DOWN_POST: '/_cms/prop/prop/under.json', // 道具下架
	_SALE_PROPERTY_CONTROL_PROPERTY_DELETE_POST: '/_cms/prop/prop/delete.json', // 道具删除
	_SALE_PROPERTY_CONTROL_PROPERTY_SAVE_POST: '/_cms/prop/prop/save.json', // 道具发布

	_SALE_PROPERTY_CONTROL_PROPERTY_SET_SAVE_POST: '/_cms/prop/prop-setting/save.json', // 道具配置保存
	_SALE_PROPERTY_PROP_SET_DETAIL_GET: "/_cms/prop/prop-setting/detail.json", // 道具配置保存
	_SALE_PROPERTY_PROP_SALE_STAFF_DETAIL_GET: "/_cms/prop/prop-setting/detail.json", // 道具配置保存

	/**
	 * 微币管理
	 */
	SALE_PROPERTY_COIN_LIST_GET: '/_cms/prop/we-coin/staff-coin-list.json', // 微币管理列表
	_SALE_PROPERTY_CONTROL_PROPERTY_CONIN_SAVE_POST: '/_cms/prop/we-coin/change-coin.json', // 微币调整
	SALE_PROPERTY_COIN_DETAIL_LIST_GET: '/_cms/prop/we-coin/staff-coin-settle-list.json', // 个人微币记录
	_SALE_PROPERTY_CONTROL_PROPERTY_CONIN_IMAGE_SAVE_POST: '/_cms/prop/we-coin/save-coin-policy-img.json', // 奖惩图片调整
	// 微币奖惩提示
	_SALE_PROPERTY_SETTING_TIPS_GET: "/_cms/prop/setting/get-tips.json",

	// 我的关注
	SALE_CUSTOMER_INTENTION_CONCERN_GET: '',
	SALE_CUSTOMER_INTENTION_CONCERN_LIST_GET: '//_sale/sale/attention-customer/my-attention.json',
	_SALE_CUSTOMET_ATTENTION_REMOVE_POST: "/_sale/sale/attention-customer/remove.json",
	_SALE_CUSTOMET_ATTENTION_CANCEL_PROP_POST: "/_sale/sale/attention-customer/cancel-prop.json",
	_SALE_CUSTOMER_ATTENTION_USE_PROP_POST: "/_sale/sale/attention-customer/use-prop.json",

	// 客户案例
	_SALE_INVOICE_CUSTOMER_INFO_GET: "/_sale/sale/invoice/get-customer-info.json",
	SALE_MAIN_CASE_LIST_GET: '/_cms/material/case-material/sale-list.json',
	_SALE_MAIN_CASE_RECOMEND_CASE_GET: "/_cms/material/case-material/recommend.json",
	_SALE_MAIN_CASE_POPULAR_CASE_GET: "/_cms/material/case-material/popular-keyword.json",
	SALE_MAIN_CASE_DETAIL_GET: '',
	_SALE_MAIN_CASE_COLLECT_DELETE_POST: "/_cms/collection/collection/del.json",
	_SALE_CUSTOMER_INTENTION_CASE_RELATE_GET: "/_cms/material/case-material/relation.json", // 相关案例
	_SALE_CUSTOMER_CASE_AGE_LIST_GET: '/_cms/material/case-material/age-list.json', // 微龄列表
	_SALE_CUSTOMER_CASE_APPLY_POST: "/_cms/material/case-material/apply.json", // 申请案例
	_SALE_CUSTOMER_INTENTION_EDIT_PRODUCT_TYPE_POST: "/_sale/sale/customer/edit-product-type.json", // 编辑产品类型
	_SALE_CUSTOMER_MAIN_RELATE_CASE_GET: "/_cms/material/case-material/detail-relation.json",

	SALE_MAIN_CIRCLE_LIST_GET: "/_cms/material/circle-material/sale-list.json",
	SALE_MAIN_CIRCLE_GET: '',
	SALE_MAIN_CIRCLE_DETAIL_GET: '',
	_SALE_MAIN_REMIND_LIST_GET: "/_notice/remind/remind/list.json", // 首页-事项提醒
	_SALE_MAIN_REMIND_IGNORE_POST: "/_notice/remind/remind/ignore.json", // 首页-事项提醒-忽略
	_SALE_MAIN_MY_COIN_OWN_COIN_GET: "/_cms/prop/we-coin/own-coin.json", // 首页-我的微币
	_SALE_MAIN_WORK_STATISTIC_GET: "/_sale/sale/dialing-recording/index-count.json", // 首页-工作数据
	_SALE_MAIN_DIALING_RECORD_STATISTICS_GET: "/_sale/sale/dialing-recording/statistics.json", // 首页-工作数据列表，通话曲线
	_SALE_MAIN_WORK_DATA_DIALING_SORT_GET: "/_sale/sale/dialing-recording/sort.json", // 首页-工作数据-通话排名
	_SALE_MAIN_WORK_DATA_DAILING_MAX_CALL_SET_POST: "/_sale/sale/dialing-recording/max-call-set.json", // 首页-工作数据-设置通话时长
	_SALE_MAIN_WORK_DATA_DAILING_STAFF_LIST_GET: "/_sale/sale/dialing-recording/staff-list.json", // 首页-工作数据-OA通话列表
	_SALE_MAIN_WORK_DATA_CALL_TODY_GET: "/_sale/sale/statistics-work-data/call-data-today.json", // 首页-工作数据-电话数据

	_SALE_CUSTOMER_DEAL_REFUND_REASON_TREE_GET: "/_cms/setting/refund/tree.json", // 退款原因树结构
	
	
	_SALE_MAIN_WORK_DATA_MORE_CHART_GET: "/_sale/sale/statistics-work-data/work-data-more-chart.json", // 工作数据-更多-图表
	SALE_MAIN_WORK_DATA_LIST_GET: "/_sale/sale/statistics-work-data/work-data-more-list.json", // 工作数据-更多-列表
	_SALE_MAIN_WORK_DATA_MORE_TIME_CONFIG_GET: "/_sale/sale/call-staff-config/get-config.json", // 工作数据-更多-获取自定义通话时长
	_SALE_MAIN_WORK_DATA_MORE_TIME_CONFIG_POST: "/_sale/sale/call-staff-config/set-config.json", // 工作数据-更多-设置自定义通话时长
	_SALE_MAIN_WORK_DATA_DAILING_COUNT: "/_sale/sale/statistics-work-data/work-data-more-info-summary.json", // 首页-工作数据-更多-详情-统计数据
	_SALE_MAIN_WORK_DATA_MORE_INFO_LIST_ADD_GET: "/_sale/sale/statistics-work-data/work-data-more-info-list-add.json", // 首页工作数据-更多-列表-详情-添加客户列表
	_SALE_MAIN_WORK_DATA_MORE_INFO_LIST_GET_GET: "/_sale/sale/statistics-work-data/work-data-more-info-list-get.json", // 首页工作数据-更多-列表-详情-领取客户列表
	_SALE_MAIN_WORK_DATA_MORE_INFO_LIST_CALL_GET: "/_sale/sale/statistics-work-data/work-data-more-info-list-call.json", // 首页工作数据-更多-列表-详情-oa通话列表



	// SALE_MAIN_WORK_DATA_DETAIL_LIST_GET: '/list'
};
export default api;
