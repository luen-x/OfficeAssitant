const api = {
	/**
	 * 请注释模块内容
	 */
	// 事件公海
	// 获取优先级
	_ADMINISTRATION_PROORITY_GET: '/_hr/logistics/event-operation/get-priority.json',
	// 审核事项
	_ADMINISTRATION_AUDIT_EVENT_POST: '/_hr/logistics/event-operation/audit.json',
	// 领取事项
	_ADMINISTRATION_RECEIVE_EVENT_POST: '/_hr/logistics/event-sea/receive.json',
	// 事项类型
	_ADMINISTRATION_EVENT_TYPE_LIST_GET: '/_hr/logistics/event-type/type-list.json',
	// 事项详情
	_ADMINISTRATION_EVENT_DETAIL_GET: '/_hr/logistics/event-operation/detail.json',
	// 事项编辑
	_ADMINISTRATION_EVENT_EDIT_POST: '/_hr/logistics/event-sea/edit-responsible-people.json',
	// 完成事项
	_ADMINISTRATION_COMPLETE_EVENT_POST: '/_hr/logistics/my-event/achieve-event.json',
	// 指派事项
	_ADMINISTRATION_ASSIGN_EVENT_POST: '/_hr/logistics/event-operation/event-assign.json',
	// 获取事项进度
	_ADMINISTRATION_GET_RATE_DETAIL_POST: '/_hr/logistics/event-operation/get-rate-detail.json',
	// 添加进度
	_ADMINISTRATION_ADD_RATE_POST: '/_hr/logistics/event-operation/add-rate-detail.json',
	// 获取总负责人
	_ADMINISTRATION_MANAGER_GET: '/_hr/api/human/get-staffs-by-depart-id-and-manager.json',
	// 获取参与人员
	_ADMINISTRATION_PK_STAFF_GET: '/_hr/human/staff/get-staff-pk-by-search.json',
	// 获取负责部门
	_ADMINISTRATION_ASSIGN_DEPART_GET: '/_hr/logistics/my-event/get-assign-depart-tree.json',
	// 获取负责人
	_ADMINISTRATION_ASSIGN_STAFF_GET: '/_hr/api/human/get-staffs-by-depart-id.json',
	// 事项公海
	ADMINISTRATION_MATTER_SEA_GET: '',
	ADMINISTRATION_MATTER_SEA_LIST_GET: '/_hr/logistics/event-sea/index.json',
	// 我的事项
	ADMINISTRATION_MATTER_MY_GET: '',
	ADMINISTRATION_MATTER_MY_LIST_GET: '/_hr/logistics/my-event/index.json',

	ADMINISTRATION_MATTER_SETTING_APPLY_GET: '',
	ADMINISTRATION_MATTER_SETTING_GET: '',
	ADMINISTRATION_MATTER_SETTING_LIST_GET: '/list',
	ADMINISTRATION_APPLICATION_MINE_LIST_GET: '/_hr/logistics/event-apply/apply-list.json',
	_ADMINISTRATION_APPLICATION_MINE_ADD_POST: '/_hr/logistics/event-apply/add.json',
	_ADMINISTRATION_APPLICATION_MINE_EVENT_APPLY_DETAIL_GET: '/_hr/logistics/event-apply/detail.json',
	ADMINISTRATION_APPLICATION_WAIT_LIST_GET: '/_hr/logistics/event-apply/audit-list.json',
	_ADMINISTRATION_APPLICATION_MINE_EVENT_APPLY_DEL_GET: '/_hr/logistics/event-apply/del.json',
	_ADMINISTRATION_APPLICATION_MINE_EVENT_APPLY_EVALUATE_POST: '/_hr/logistics/event-apply/evaluate-event.json',
	_ADMINISTRATION_APPLICATION_MINE_EVENT_APPLY_RATE_DETAIL_GET: '/_hr/logistics/event-apply/rate-detail.json',
	_ADMINISTRATION_APPLICATION_MINE_EVENT_APPLY_RATE_AUDIT_EVENT_POST: '/_hr/logistics/event-apply/audit-event.json',

	ADMINISTRATION_MATTER_SETTING_TYPE_GET: '',

	// 事项类型
	ADMINISTRATION_MATTER_SETTING_TYPE_LIST_GET: '/_hr/logistics/event-type/list.json',
	_ADMINISTRATION_MATTER_TYPE_ADD_POST: '/_hr/logistics/event-type/add.json',
	_ADMINISTRATION_MATTER_TYPE_DEL_POST: '/_hr/logistics/event-type/del.json',

	// 申请权限
	_ADMINISTRATION_MATTER_APPLY_LIST_GET: '/_hr/logistics/event-approve-set/list.json',
	_ADMINISTRATION_MATTER_APPLY_ADD_POST: '/_hr/logistics/event-approve-set/add.json',
	_ADMINISTRATION_MATTER_APPLY_DEL_POST: '/_hr/logistics/event-approve-set/del.json',
	_ADMINISTRATION_MATTER_APPLY_POSITION_LIST_GET: '/_hr/human/position/list.json',

	// 获取部门
	_ADMINISTRATION_DEPART_GET: '/_hr/human/depart/all.json',
	_ADMINISTRATION_FIRST_DEPART_GET: '/_hr/human/depart/get-first-depart-son-tree.json',
	_ADMINISTRATION_MANAGER_DEPART_GET: '/_hr/human/depart/get-depart-manager-by-depart-id.json',

	// 话机管理
	ADMINISTRATION_PHONE_LIST_GET: '/_hr/human/phone-manage/list.json',
	_ADMINISTRATION_PHONE_DOWNLOAD_TEMPLATE_GET: '/_hr/human/phone-manage/download-template.json',
	_ADMINISTRATION_PHONE_IMPORT_PHONE_POST: '/_hr/human/phone-manage/import-phone.json',
	_ADMINISTRATION_PHONE_STAFF_NEW_GET: '/_hr/human/phone-manage/add-select.json',
	_ADMINISTRATION_PHONE_ADD_OR_EDIT_STAFF_POST: '/_hr/human/phone-manage/add.json',
	_ADMINISTRATION_PHONE_DEL_POST: '/_hr/human/phone-manage/del.json',
	
};
export default api;
