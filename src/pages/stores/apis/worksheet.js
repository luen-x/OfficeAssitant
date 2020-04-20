const api = {
	/**
	 * bug管理
	 */
	WORKSHEET_CONTROL_BUG_GET: '',
	WORKSHEET_CONTROL_BUG_LIST_GET: '/_tech/bug/bug/list.json',
	WORKSHEET_CONTROL_PROJECT_GET: '',
	_WORKSHEET_CONTROL_BUG_ADD_POST: '/_tech/bug/bug/create.json',
	_WORKSHEET_CONTROL_BUG_EXPORT_GET: '/_tech/bug/bug/export.json', // bug 列表导出
	_WORKSHEET_CONTROL_BUG_SYSTEM_GET: '/_tech/bug/bug/get-system.json',
	_WORKSHEET_CONTROL_BUG_MODULE_GET: '/_tech/bug/bug/get-system-module.json',
	_WORKSHEET_CONTROL_BUG_RELATION_GET: '/_tech/bug/bug/get-relation-person.json',
	_WORKSHEET_CONTROL_COMPANY_BUG_GET: '/_sale/sale/deal-customer/search-company-list.json', // 获取成交公司
	_WORKSHEET_CONTROL_TECH_STAFF_GET: '/_tech/bug/bug/get-assign-staff.json', // 获取产品技术部人员
	_WORKSHEET_CONTROL_TECH_EDIT_INFO_GET: '/_tech/bug/bug/get-info.json', // 获取bug编辑详情
	_WORKSHEET_CONTROL_TECH_ROLE_GET: '/_tech/bug/bug/get-role.json', // 获取登陆角色role
	/**
	 * 工单详情
	 */
	WORKSHEET_CONTROL_BUG_DETAIL_GET: '',
	_WORKSHEET_CONTROL_BUG_DETAIL_SHOW_CHAT_GET: '/_tech/bug/bug/show-chat.json', // 展示沟通记录
	_WORKSHEET_CONTROL_BUG_DETAIL_INFO_GET: '/_tech/bug/bug/info.json', // bug详情

	_WORKSHEET_CONTROL_BUG_DETAIL_ASK_POST: '/_tech/bug/bug/ask.json', // 提问
	_WORKSHEET_CONTROL_BUG_DETAIL_FEEDBACK_POST: '/_tech/bug/bug/feedback.json', // 反馈
	_WORKSHEET_CONTROL_BUG_DETAIL_GET_INFO_POST: '/_tech/bug/bug/get-info.json', // 编辑时获取bug详情
	_WORKSHEET_CONTROL_BUG_DETAIL_CONFIRM_POST: '/_tech//bug/bug/confirm.json', // 确认bug
	_WORKSHEET_CONTROL_BUG_DETAIL_RESOLVE_POST: '/_tech//bug/bug/resolve.json', // 已解决bug
	_WORKSHEET_CONTROL_BUG_DETAIL_NO_SOLUTION_POST: '/_tech/bug/bug/no-solution.json', // 不予解决
	_WORKSHEET_CONTROL_BUG_DETAIL_VERIFY_PASS_POST: '/_tech/bug/bug/verify-pass.json', // 验证通过
	_WORKSHEET_CONTROL_BUG_DETAIL_DELETE_POST: '/_tech/bug/bug/delete.json', // 删除bug
	_WORKSHEET_CONTROL_BUG_DETAIL_CLOSE_POST: '/_tech/bug/bug/close.json', // 关闭bug
	_WORKSHEET_CONTROL_BUG_DETAIL_ACTIVATE_POST: '/_tech/bug/bug/activate.json', // 激活bug
	_WORKSHEET_CONTROL_BUG_DETAIL_ASSIGN_POST: '/_tech/bug/bug/assign.json', // 指派bug

	WORKSHEET_CONTROL_PROJECT_ADD_GET: '',
	WORKSHEET_CONTROL_PROJECT_DETAIL_GET: '',

	/**
	 * 项目管理
	 */
	_WORKSHEET_CONTROL_PROJECT_ADD_POST: '/_tech/bug/system/add.json', // 新增、编辑项目
	_WORKSHEET_CONTROL_PROJECT_CLOSE_POST: '/_tech/bug/system/close.json', // 关闭项目
	_WORKSHEET_CONTROL_PROJECT_DEL_POST: '/_tech/bug/system/del.json', // 删除项目
	_WORKSHEET_CONTROL_MODULE_ADD_POST: '/_tech/bug/system/module-add.json', // 新增、编辑模块
	_WORKSHEET_CONTROL_MODULE_DEL_POST: '/_tech/bug/system/module-del.json', // 删除模块


	_WORKSHEET_CONTROL_PROJECT_DETAIL_GET: '/_tech/bug/system/detail.json', // 项目详情
	_WORKSHEET_CONTROL_PROJECT_STAFF_LIST_GET: '/_tech/bug/system/staff-list.json', // 搜索负责人


	WORKSHEET_CONTROL_PROJECT_LIST_GET: '/_tech/bug/system/list.json', // 项目列表
};

export default api;