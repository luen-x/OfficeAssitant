const api = {
	/**
	 * 请注释模块内容
	 */
	// 活动管理->活动列表
	CONTENT_ACTIVITY_LIST_GET: '/_cms/activity/activity/activity-list.json',
	CONTENT_ACTIVITY_EDIT_ACTIVITY_POST: '/_cms/activity/activity/edit-activity.json',
	_CONTENT_ACTIVITY_DETAIL_GET: '/_cms/activity/activity/activity-details.json?',
	_CONTENT_ACTIVITY_EDIT_POST: '/_cms/activity/activity/add-activity.json',
	// 活动分类列表
	_CONTENT_ACTIVITY_CATEGORY_GET: '/_cms/activity/activity/activity-category.json',
	_CONTENT_ACTIVITY_ADD_ACTIVITY_POST: '/_cms/activity/activity/add-activity.json',
	_CONTENT_ACTIVITY_LIST_CLOSE_POST: '/_cms/activity/activity/close-apply.json',

	// 活动管理-> 活动审核
	// CONTENT_ACTIVITY_AUDIT_GET: '/_cms/activity/activity-apply/apply-list.json',
	// 活动审核列表数据
	CONTENT_ACTIVITY_AUDIT_LIST_GET: '/_cms/activity/activity-apply/apply-list.json',
	// 审核活动是否通过
	_CONTENT_ACTIVITY_AUDIT_PASS_POST: '/_cms/activity/activity-apply/pass.json',
	// 获取复训次数、合作类别、行业、职位等数据
	_CONTENT_ACTIVITY_AUDIT_POSITION_INFO_GET: '/_cms/activity/activity-apply/get-retrain-num.json',
	// 活动审核修改
	_CONTENT_ACTIVITY_AUDIT_EDIT_POST: '/_cms/activity/activity-apply/edit-apply.json',
	_CONTENT_ACTIVITY_AUDIT_ABSENT_POST: '/_cms/activity/activity-apply/absent.json', // 活动审核 - 缺席
	_CONTENT_ACTIVITY_AUDIT_RECEVORY_POST: '/_cms/activity/activity-apply/recovery.json', // 活动审核 - 恢复
	// 获取客户类型
	_CONTENT_ACTIVITY_AUDIT_CUSTOMER_TYPE_GET: '/_cms/activity/activity-apply/get-customer-type.json',
	// 获取活动详情
	_CONTENT_ACTIVITY_AUDIT_DETAIL_GET: '/_cms/activity/activity-apply/apply-detail.json',
	// 活动管理->活动分类
	CONTENT_ACTIVITY_CLASSIFY_GET: '',
	// 活动分类列表
	CONTENT_ACTIVITY_CLASSIFY_LIST_GET: '/_cms/activity/activity-category/category-list.json',
	_CONTENT_ACTIVITY_CLASSIFY_RENAME_POST: '/_cms/activity/activity-category/update-name.json',
	_CONTENT_ACTIVITY_CLASSIFY_DELETE_POST: '/_cms/activity/activity-category/delete.json',
	_CONTENT_ACTIVITY_CLASSIFY_ADD_POST: '/_cms/activity/activity-category/add-category.json',
	_CONTENT_ACTIVITY_CLASSIFY_UPDATE_IMAGE_POST: '/_cms/activity/activity-category/update-image.json',
	// 查看分类下的活动
	_CONTENT_ACTIVITY_CLASSIFY_CATEGORY_GET: '/_cms/activity/activity-category/look.json',
	CONTENT_SETOOLKIT_MANAGE_GET: '',
	CONTENT_SETOOLKIT_MANAGE_LIST_GET: '/_cms/toolkit/kit-material/list.json',
	CONTENT_SETOOLKIT_SET_GET: '',
	CONTENT_SETOOLKIT_SET_LIST_GET: '/_cms/toolkit/kit-category/list.json',
	CONTENT_SETOOLKIT_DOWNLOAD_GET: '',
	CONTENT_SETOOLKIT_DOWNLOAD_LIST_GET: '/_cms/toolkit/kit-download/list.json',
	CONTENT_SATOOLKIT_MANAGE_GET: '',
	CONTENT_SATOOLKIT_MANAGE_LIST_GET: '/_cms/toolkit/kit-material/list.json',
	CONTENT_SATOOLKIT_SET_GET: '',
	CONTENT_SATOOLKIT_SET_LIST_GET: '/_cms/toolkit/kit-category/list.json',
	CONTENT_SATOOLKIT_DOWNLOAD_GET: '',
	CONTENT_SATOOLKIT_DOWNLOAD_LIST_GET: '/_cms/toolkit/kit-download/list.json',

	// 产品管理
	CONTENT_PRODUCT_LIST_GET: '/_cms/product/product/product-list.json',
	CONTENT_PRODUCT_SKU_COMPONENT_TYPE_GET: '/_cms/product/component/get-product-sku-component.json',

	CONTENT_PRODUCT_GROUP_GET: '',
	CONTENT_PRODUCT_GROUP_LIST_GET: '/_cms/product/product-combine/combine-list.json',
	_CONTENT_PRODUCT_GROUP_DEL_POST: '/_cms/product/product-combine/del-combine.json',
	_CONTENT_PRODUCT_GROUP_ELE_GET: '/_cms/product/product-combine/get-product.json', // 产品组合 - 根据分类获取产品
	_CONTENT_PRODUCT_GROUP_SAVE_GET: '/_cms/product/product-combine/save.json', // 产品组合-保存新建/编辑
	_CONTENT_PRODUCT_GROUP_EDIT_GET: '/_cms/product/product-combine/get-product-combine.json', // 产品组合编辑
	CONTENT_PRODUCT_SET_GET: '',
	CONTENT_PRODUCT_SET_LIST_GET: '/list',
	CONTENT_PRODUCT_REQUEST_LIST_GET: '/list',
	_CONTENT_PRODUCT_ELEMENT_GET: '/_cms/product/component/get-request-component.json', // 元器件获取
	CONTENT_PRODUCT_SET_PROCESS_GET: '',
	CONTENT_PRODUCT_SET_PROCESS_LIST_GET: '/_cms/product/product-process/process-list.json', // 流程 - 列表
	_CONTENT_PRODUCT_PROCESS_ELEMENT_GET: '/_cms/product/component/get-process-component.json', // 元件 - 获取流程步骤元件
	_CONTENT_PRODUCT_NEW_GET: '/_cms/product/product/add-product-page.json', // 产品 - 新建产品页面数据
	_CONTENT_PRODUCT_SAVE_GET: '/_cms/product/product/save.json', // 产品 - 保存新建
	_CONTENT_PRODUCT_EDIT_GET: '/_cms/product/product/get-product.json', // 产品 - 编辑产品页面数据
	_CONTENT_PRODUCT_LIST_DEL_POST: '/_cms/product/product/del-product.json', // 产品 - 删除
	_CONTENT_PRODUCT_CATEGORY_GET: '/_cms/product/product-category/get-product-category.json', // 产品分类 - 获取
	_CONTENT_PRODUCT_EDIT_CATEGORY_POST: '/_cms/product/product-category/add-product-category.json', // 产品分类 - 添加/编辑
	_CONTENT_PRODUCT_DEL_CATEGORY_POST: '/_cms/product/product-category/delete.json', // 产品分类 - 添加/编辑
	_CONTENT_PRODUCT_COMPONENT_TYPE_GET: '/_cms/product/component/get-component-type.json', // 产品分类 - 添加/编辑
	_CONTENT_PRODUCT_PROCESS_DETAIL_GET: '/_cms/product/product/get-process-detail.json', // 产品 - 根据process_id获取步骤
	_CONTENT_PRODUCT_PROCESS_DEL_POST: '/_cms/product/product-process/process-del.json', // 流程删除
	_CONTENT_PRODUCT_SET_PROCESS_LIST_EDIT_GET: '/_cms/product/product-process/edit-process-page.json', // 流程需求 - 编辑页面
	_CONTENT_PRODUCT_PROCESS_SAVE_POST: '/_cms/product/product-process/save-process.json', // 流程 - 保存新建/编辑数据
	_CONTENT_PRODUCT_PRICE_UNIT_GET: '/_cms/product/product/get-price-unit.json', // 流程 - 保存新建/编辑数据



	CONTENT_PRODUCT_SET_PROJECT_LIST_GET: '/_cms/product/product-process/request-list.json', // 项目需求列表,
	_CONTENT_PRODUCT_SET_PROJECT_LIST_DEL_GET: '/_cms/product/product-process/request-del.json', // 项目需求删除,
	_CONTENT_PRODUCT_SET_PROJECT_LIST_EDIT_GET: '/_cms/product/product-process/edit-request-page.json', // 项目需求 - 编辑页面,
	_CONTENT_PRODUCT_SET_PROJECT_LIST_SAVE_GET: '/_cms/product/product-process/save-request.json', // 项目需求 - 保存新建/编辑数据

	CONTENT_PRODUCT_SET_CUSTOMER_LIST_GET: '/_cms/product/product-process/customer-info-list.json', // 客户信息 - 列表
	_CONTENT_PRODUCT_SET_CUSTOMER_LIST_DEL_GET: '/_cms/product/product-process/customer-del.json', // 客户信息 删除,
	_CONTENT_PRODUCT_SET_CUSTOMER_LIST_EDIT_GET: '/_cms/product/product-process/edit-customer-page.json', // 客户信息  - 编辑页面,
	_CONTENT_PRODUCT_SET_CUSTOMER_LIST_SAVE_GET: '/_cms/product/product-process/save-customer-info.json', // 客户信息  - 保存新建/编辑数据
	_CONTENT_PRODUCT_CUSTOMER_ELEMENT_GET: '/_cms/product/component/get-customer-component.json', // 元件 - 获取客户信息元件
	CONTENT_PRODUCT_LIST_RECYCLE_GET: '/_cms/product/product/recycle-list.json', // 回收站列表
	_CONTENT_PRODUCT_LIST_RECOVERY_GET: '/_cms/product/product/recovery.json', // 回收站列表恢复

	/**
	 * 资讯管理
	 */
	CONTENT_INFORMATION_MANAGE_GET: '',
	CONTENT_INFORMATION_MANAGE_LIST_GET: '/_cms/information/information/list.json',
	_CONTENT_INFORMATION_MANAGE_ALL_GET: '/_cms/information/information-category/all.json', // 素材 - 分类树
	_CONTENT_INFORMATION_MANAGE_SIMPLE_GET: '/_cms/information/information-category/simple-category.json', // 咨询 - 关联分类
	_CONTENT_INFORMATION_MANAGE_CHECK_GET: '/_cms/information/information/detail.json', // 查看咨询
	_CONTENT_INFORMATION_MANAGE_RELATION_GET: '/_cms/information/information/relation-list.json', // 详情页相关咨询
	_CONTENT_INFORMATION_MANAGE_NEW_GET: '/_cms/information/information/new-list.json', // 详情页最新咨询
	_CONTENT_INFORMATION_MANAGE_CHECK_PLUS_GET: '/_cms/information/information/view.json', // 查看咨询 计入浏览

	_CONTENT_INFORMATION_MANAGE_DEL_POST: '/_cms/information/information/del.json', // 资讯删除
	_CONTENT_INFORMATION_MANAGE_BATCH_POST: '/_cms/information/information/batch-del.json', // 资讯批量删除
	_CONTENT_INFORMATION_MANAGE_CREATE_AND_EDIT_POST: '/_cms/information/information/create-and-edit.json', // 资讯创建和修改素材
	_CONTENT_INFORMATION_MATERIAL_DELS_GET: '/_cms/information/information-category/del.json', // 咨询分类删除
	// 资讯分类
	CONTENT_INFORMATION_CLASSIFY_GET: '',
	CONTENT_INFORMATION_CLASSIFY_LIST_GET: '/_cms/information/information-category/list.json',
	_CONTENT_INFORMATION_MATERIAL_ALL_GET: '/_cms/information/information-category/parent-list.json', // 咨询添加顶级类
	_CONTENT_INFORMATION_MATERIAL_DETAIL_GET: '/_cms/information/information-category/detail.json', // 咨询分类 - 详情

	_CONTENT_INFORMATION_CLASSIFY_CREATE_AND_EDIT_POST: '/_cms/information/information-category/create-and-edit.json',

	/**
	 * 通知管理
	 */
	CONTENT_NOTICE_INFORM_GET: '',
	// 通知列表
	CONTENT_NOTICE_INFORM_LIST_GET: '/_cms/notice/notice/notice-list.json',
	// 新增通知
	_CONTENT_NOTICE_ADD_NOTICE_INFORM_POST: '/_cms/notice/notice/create-notice.json',
	// 通知详情
	_CONTENT_NOTICE_INFORM_DETAIL_GET: '/_cms/notice/notice/detail.json',
	// 通知-关闭/开启
	_CONTENT_NOTICE_INFORM_TOGGLE_STATUS_POST: '/_cms/notice/notice/close-open.json',
	// 通知-删除
	_CONTENT_NOTICE_INFORM_DELETE_POST: '/_cms/notice/notice/delete.json',

	/**
	 * 互动大屏
	 */
	_CONTENT_INTERACTION_SEND_POST: '/_cms/notice/interact-screen/save-interact.json', // 消息发送
	_CONTENT_INTERACTION_SEARCH_POST: '/_cms/notice/interact-screen/interact-list.json', // 消息搜索
	CONTENT_INTERACTION_GET: '',
	CONTENT_PREVIEW_GET: '',
	CONTENT_SEARCH_GET: '/_cms/material/material/relation-list.json',
	CONTENT_SEARCH_RESULT_GET: '/_cms/search/search/search.json',
	_CONTENT_SEARCH_RECOMMEND_LIST_GET: '/_cms/search/search/recommend-search.json',
	_CONTENT_SEARCH_HISTORY_LIST_GET: '/_cms/search/search/history-search.json',
	CONTENT_MATERIAL_MANAGE_PREVIEW_GET: '',
	CONTENT_INFORMATION_MANAGE_PREVIEW_GET: '',
	CONTENT_CUSTOMER_PREVIEW_GET: '',

	/**
	 * 工具包管理
	 */
	// 分类列表
	CONTENT_CLASS_LIST_POST: '/_cms/toolkit/kit-category/list.json',
	// 删除销售工具包素材
	_CONTENT_MATERIAL_DEL_GET: '/_cms//toolkit/kit-material/del.json',
	// 删除服务工具包素材
	_CONTENT_SERVICE_MATERIAL_DEL_GET: '/_cms//toolkit/kit-material/service-del.json',
	// 分类下的权限
	_CONTENT_MATERIAL_ROLE_LIST_GET: '/_cms/toolkit/kit-category/role-list.json',
	// 销售工具包创建
	_CONTENT_MATERIAL_CREATE_AND_EDIT_POST: '/_cms/toolkit/kit-material/create-and-edit.json',
	// 服务工具包创建
	_CONTENT_SERVICE_CREATE_AND_EDIT_POST: '/_cms/toolkit/kit-material/service-create-and-edit.json',
	// 主分类列表
	_CONTENT_CATEGORY_LIST_GET: '/_cms/toolkit/kit-category/all.json',
	// 销售工具包类目创建
	_CONTENT_CATEGORY_CREATE_AND_EDIT_POST: '/_cms/toolkit/kit-category/create-and-edit.json',
	// 服务工具包类目创建
	_CONTENT_SERVICE_CATEGORY_CREATE_AND_EDIT_POST: '/_cms/toolkit/kit-category/service-create-and-edit.json',
	// 所有权限
	_CONTENT_ALL_ROLE_GET: '/_cms/toolkit/kit-category/all-role.json',
	// 删除销售工具包分类
	_CONTENT_CATEGORY_DEL_GET: '/_cms/toolkit/kit-category/del.json',
	// 删除服务工具包分类
	_CONTENT_SERVICE_CATEGORY_DEL_GET: '/_cms/toolkit/kit-category/service-del.json',
	// 分类详情
	_CONTENT_CATEGORY_DETAIL_GET: '/_cms/toolkit/kit-category/detail.json',
	// 素材详情
	_CONTENT_TOOLKIT_MATERIAL_DETAIL_GET: '/_cms/toolkit/kit-material/detail.json',
	// 修改排序
	_CONTENT_SORT_EDIT_POST: '/_cms/toolkit/kit-material/set-sort-value.json',
	// 批量删除销售工具包-素材
	_CONTENT_MATERIAL_BATCH_DELATE_POST: '/_cms/toolkit/kit-material/batch-del.json',
	// 批量删除服务工具包-素材
	_CONTENT_SERVICE_MATERIAL_BATCH_DELATE_POST: '/_cms/toolkit/kit-material/service-batch-del.json',
	// 批量删除销售工具包-类目
	_CONTENT_CATEGORY_BATCH_DELATE_POST: '/_cms/toolkit/kit-category/batch-del.json',
	// 批量删除服务工具包-类目
	_CONTENT_SERVICE_CATEGORY_BATCH_DELATE_POST: '/_cms/toolkit/kit-category/service-batch-del.json',
	// 服务关联项
	_CONTENT_SERVICE_LIST_GET: '/_cms/toolkit/kit-material/set-list.json',
	// 检查类目名是否可用
	_CONTENT_CATEGORY_IS_USE_GET: '/_cms/toolkit/kit-category/is-use.json',
	/**
	* 素材库
	*/
	_CONTENT_CONFIG_LIBRARY_CATEGORY_SAVE: '/_cms/library/library-category/save.json', // 类目设置
	CONTENT_CONFIG_MATERIAL_SET_LIST_GET: '/_cms/library/library-category/list.json', // 类目列表
	_CONTENT_CONFIG_LIBRARY_CATEGORY_DETAIL: '/_cms/library/library-category/detail.json', // 类目详情
	_CONTENT_CONFIG_LIBRARY_CATEGORY_DEL_POST: '/_cms/library/library-category/del.json', // 单个删除
	_CONTENT_CONFIG_LIBRARY_CATEGORY_BATCH_DEL_POST: '/_cms/library/library-category/batch-del.json', // 批量删除
	_CONTENT_CONFIG_LIBRARY_CATEGORY_ALL_GET: '/_cms/library/library-category/all.json', // 类目树
	_CONTENT_CONFIG_LIBRARY_CATEGORY_ROLE_LIST_GET: '/_cms/library/library-category/role-list.json', // 获取类目权限
	CONTENT_CONFIG_MATERIAL_BANK_LIST_GET: '/_cms/library/library-material/list.json', // 素材列表
	CONTENT_CONFIG_MATERIAL_RECORD_LIST_GET: '',
	CONTENT_CONFIG_MATERIAL_DOWNLOAD_LIST_GET: '/_cms/download/material-download/list.json', // 素材 - 下载记录
	CONTENT_CONFIG_MATERIAL_UPLOAD_LIST_GET: '/_cms/download/material-download/upload-list.json', // 素材 - 下载记录
	CONTENT_CONFIG_MATERIAL_CHECK_LIST_GET: '/_cms/library/library-material/audit-list.json', // 素材 - 审核列表
	CONTENT_CONFIG_MATERIAL_ROLE_LIST_GET: '/_cms/library/library-apply/audit-list.json', // 素材 - 查看权限审核列表
	_CONTENT_CONFIG_MATERIAL_MATERIAL_SAVE_GET: '/_cms/library/library-material/material-save.json', // 素材 - 上传文件列表
	_CONTENT_CONFIG_GET_ALL_STAFF_BY_SEARCH_GET: '/_hr/api/human/get-all-staff-by-search.json', // 根据条件获得员工列表
	_CONTENT_CONFIG_MATERIAL_CHECK_PASS_POST: '/_cms/library/library-material/check-pass.json', // 审核通过
	_CONTENT_CONFIG_MATERIAL_CHECK_REFUSE_POST: '/_cms/library/library-material/check-refuse.json', //  素材申请审核驳回
	_CONTENT_CONFIG_MATERIAL_MATERIAL_DETAIL_GET: '/_cms/library/library-material/get-material-detail.json', //  素材 - 素材详情
	_CONTENT_CONFIG_MATERIAL_TYPE_DETAIL_GET: '/_cms/library/library-material-tape/get-tape-detail.json', //  素材 -  录音表单详情
	_CONTENT_CONFIG_MATERIAL_TYPE_SAVE_POST: '/_cms/library/library-material-tape/tape-save.json', //  素材 - 录音表单保存
	_CONTENT_CONFIG_MATERIAL_APPLY_AUDIT_GET: '/_cms/library/library-apply/audit-detail.json', //  素材 - 权限申请审核流程
	_CONTENT_CONFIG_MATERIAL_MATERIAL_TYPE_GET: '/_cms/library/library-material/material-type.json', //  素材 - 类型
	_CONTENT_CONFIG_MATERIAL_MATERIAL_USE_GET: '/_cms/library/library-material/material-use.json', //  素材 - 用途
	_CONTENT_CONFIG_MATERIAL_SET_SORT_VAlUE_GET: '/_cms/library/library-material/set-sort-value.json', //  素材 - 素材排序
	_CONTENT_CONFIG_ROLE_APPLY_AUDIT_POST: '/_cms/library/library-apply/apply-audit.json', //  素材 - 权限申请审核
	_CONTENT_CONFIG_MATERIAL_GET_tape_data_GET: '/_cms/library/library-material-tape/get-tape-data.json', //  素材 - 权限申请审核
	_CONTENT_CONFIG_MATERIAL_CHECK_MATERIAL_POST: '/_cms/library/library-material/check-material.json', //  素材 - 素材 - 素材审核（cms）：上传原文件、上传编辑后文件、上传编辑后素材
	_CONTENT_CONFIG_MATERIAL_DEL_POST: '/_cms/library/library-material/del.json', //  素材 - 删除
	_CONTENT_CONFIG_MATERIAL_UPLOAD_SUCCESS_POST: '/_cms/library/library-material/upload-success.json', //  素材 - 删除
	_CONTENT_CONFIG_MATERIAL_EDIT_POST: '/_cms/library/library-material/edit-material.json', //  素材 - 删除
	_CONTENT_LIBRARY_MATERIAL_FOLDER_PREVIEW_POST: '/_cms/library/library-folder/folder-preview.json', //  素材审核 - 文件夹预览
	_CONTENT_LIBRARY_MATERIAL_GET_COURSE_POST: '/_cms/library/library-material/get-course.json', //  素材审核 - 文件夹预览
	_CONTENT_LIBRARY_MATERIAL_APPLY_CANCEL_POST: '/_cms/library/library-apply/apply-cancel.json', //  素材审核 - 文件夹预览
	_CONTENT_LIBRARY_MATERIAL_UPLOAD_FAIL_POST: '/_cms/library/library-material/upload-fail.json', //  素材上传失败通知
	_CONTENT_MATERIAL_DOWNLOAD_WARNING_RULE_SAVE_POST: '/_cms/download/warning-rule/save.json', //  预警配置 - 保存
	_CONTENT_MATERIAL_DOWNLOAD_WARNING_RULE_DETAIL_GET: '/_cms/download/warning-rule/detail.json', //  预警配置 - 详情
	_CONTENT_MATERIAL_DOWNLOAD_WARNING_RULE_DELETE_GET: '/_cms/download/warning-rule/delete.json', //  预警配置 - 详情
	_CONTENT_MATERIAL_DOWNLOAD_WARNING_LIMIT_NOTICE_GET: '/_cms/download/warning-rule/limit-notice.json', //  下载预警配置





	_CONTENT_CONFIG_MATERIAL_CHECK_TAPE_DETAIL_GET: '/_cms/library/library-material/material-tape-detail.json', //  素材审核 - 查看：

	// 服务管理
	CONTENT_SERVICE_SETTING_LIST_GET: '/_sc/center/set/list.json',
	// 适用职位
	_CONTENT_SERVICE_SETTING_ROLE_DATA_GET: '/_hr/human/staff/get-all-position.json',
	// 关联产品
	_CONTENT_SERVICE_SETTING_SET_INFO_GET: '/_sc/center/set/get-item-set-info.json',
	_CONTENT__SERVICE_SETTING_PRODUCT_NAME_GET: '/_cms/api/product/get-product-name.json',
	// 服务项详情
	_CONTENT__SERVICE_SETTING_GET_ITEM_SET_INFO_GET: '/_sc/center/set/get-item-set-info.json',

	// 删除
	_CONTENT_SERVICE_SETTING_DELETE_POST: '/_sc/center/set/delete.json',
	// 添加服务项
	_CONTENT_SERVICE_SETTING_SET_POST: '/_sc/center/set/set.json',
	// 编辑服务项
	_CONTENT_SERVICE_SETTING_EDIT_POST: '/_sc/center/set/edit.json',
	CONTENT_CONFIG_STATISTICS_MANAGE_GET: '',
	CONTENT_CONFIG_STATISTICS_MANAGE_LIST_GET: '/_cms/download/material-download/statistics.json',
	CONTENT_CONFIG_STATISTICS_MANAGE_DETAIL_GET: '',
	CONTENT_CONFIG_STATISTICS_MANAGE_DETAIL_LIST_GET: '/_cms/download/material-download/list.json',
	CONTENT_CONFIG_STATISTICS_WARNING_GET: '',
	CONTENT_CONFIG_STATISTICS_WARNING_LIST_GET: '/_cms/download/warning-rule/list.json',

	// 微信推送
	CONTENT_NOTICE_WECHAT_GET: '',
	CONTENT_NOTICE_WECHAT_LIST_GET: '/_notice/notice/notice-config/list.json',

	_CONTENT_NOTICE_WECHAT_SWITCH_POST: '/_notice/notice/notice-config/switch.json',
	_CONTENT_NOTICE_WECHAT_DELETE_CACHE_POST: '/_notice/notice/notice-config/delete-cache.json', // 清除通知缓存,
	CONTENT_INFORMATION_PUBLISH_GET: '',
	CONTENT_INFORMATION_PUBLISH_LIST_GET: '/_cms/information/means/list.json',
	CONTENT_INFORMATION_PUBLISH_MANAGE_GET: '',
	CONTENT_INFORMATION_PUBLISH_MANAGE_LIST_GET: '/_cms/information/means-category/list.json',
	CONTENT_INFORMATION_PUBLISH_CONTENT_GET: '',
	CONTENT_INFORMATION_PUBLISH_CONTENT_LIST_GET: '/list',
	_CONTENT_CATEGORY_TREE_GET: '/_cms/information/means-category/all.json',
	_CONTENT_CATEFORY_TREE_ADD_POST: '/_cms/information/means-category/save.json',
	_CONTENT_CATEFORY_TREE_DEL_POST: '/_cms/information/means-category/delete.json',

	_CONTENT_INFORMATION_COTNENT_PUBLISH_POST: '/_cms/information/means/save.json',
	_CONTENT_INFORMATION_COTNENT_UNDER_POST: '/_cms/information/means/under.json',
	_CONTENT_INFORMATION_COTNENT_UP_POST: '/_cms/information/means/publish.json',
	_CONTENT_INFORMATION_COTNENT_DELETE_POST: '/_cms/information/means/delete.json',
	_CONTENT_INFORMATION_COTNENT_DETAIL_GET: '/_cms/information/means/detail.json',

	/**
	 * 微币惩奖设置
	 */

	_CONTENT_REWARD_SETTING_SAVE_POST: '/_cms/prop/setting/save.json',
	_CONTENT_REWARD_SETTING_INFO_GET: '/_cms/prop/setting/info.json',
	_CONTENT_REWARD_COIN_CATEGORY_GET: '/_cms/prop/we-coin/get-coin-category.json',
	CONTENT_REWARD_GET: '',
	CONTENT_RULES_SALE_GET: '',

	/**
	 * 销售规则设置
	*/
	_CONTENT_SYSTEM_SALE_GET_OTHER_CONFIG_GET: '/_sale/sale/system/get-other-config.json',
	_CONTENT_SYSTEM_SALE_CUSTOMER_EDIT_CONFIG_GET: '/_sale/sale/customer-edit-config/get-config.json',
	_CONTENT_SYSTEM_SALE_CUSTOMER_EDIT_CONFIG_SAVE_POST: '/_sale/sale/customer-edit-config/save-config.json',

	_CONTENT_SYSTEM_SALE_CONFIG_RECORD_LOG_POST: '/_sale/sale/system/save-config-record-log.json', // 编辑保存其他配置-跟进举报次数限制
	_CONTENT_SYSTEM_SALE_CONFIG_RELATION_POST: '/_sale/sale/system/save-config-relation.json', // 编辑保存其他配置-关联举报次数限制
	_CONTENT_SYSTEM_SALE_CONFIG_PROTECT_POST: '/_sale/sale/system/save-config-protect.json', // 编辑保存其他配置-跟进举报次数限制
	_CONTENT_SYSTEM_SALE_CONFIG_SIGN_POST: '/_sale/sale/system/save-config-sign.json', // 编辑保存其他配置-跟进举报次数限制
	_CONTENT_SYSTEM_SALE_CONFIG_AUDIT_POST: '/_sale/sale/system/save-config-audit.json', // 编辑保存其他配置-跟进举报次数限制
	_CONTENT_SYSTEM_SALE_CONFIG_TIME_CALL_POST: '/_sale/sale/system/save-config-time-call.json', // 编辑保存其他配置-通话时长限制
	_CONTENT_SYSTEM_SALE_CONFIG_TIME_REPORT_POST: '/_sale/sale/system/save-config-time-report.json', // 编辑保存其他配置-辩护期时长限制
	// _CONTENT_SYSTEM_SALE_GET_CONFIG_RELATION_GET: '/_sale/sale/system/get-config-relation.json',

	// 发圈素材管理
	CONTENT_CIRCLE_LIST_GET: '/_cms/material/circle-material/list.json', // 发圈素材列表
	_CONTENT_CIRCLE_DETAIL_GET: "/_cms/material/circle-material/detail.json", // 发圈素材详情
	_CONTENT_CIRCLE_SAVE_POST: "/_cms/material/circle-material/save.json", // 发圈素材保存
	_CONTENT_CIRCLE_DELETE_POST: "/_cms/material/circle-material/delete.json", // 发圈素材删除
	_CONTENT_CIRCLE_CATEGORY_SAVE_POST: "/_cms/material/circle-category/save.json", // 发圈素材-类目-保存
	_CONTENT_CIRCLE_CATEGORY_GET: "/_cms/material/circle-category/list.json", // 发圈素材类目
	_CONTENT_CIRCLE_CATEGORY_CHANGE_POST: "/_cms/material/circle-material/change.json", // 发圈素材-类目-变更

	CONTENT_CIRCLE_ADD_GET: '',
	CONTENT_CIRCLE_LIST_DETAIL_GET: ''
};

export default api;
