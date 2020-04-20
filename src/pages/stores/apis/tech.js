const api = {
	/**
	 * 请注释模块内容
	 */
	_TECH_PROJECT_PLAN_OVERVIEW_ADD_POST: "/_tech/project/project/add.json", // 添加、编辑项目
	_TECH_PROJECT_PLAN_OVERVIEW_DEL_POST: "/_tech/project/project/del.json", // 删除项目
	_TECH_PROJECT_NEED_ADD_POST: "/_tech/project/project-need/add.json", // 项目需求-新增、修改
	_TECH_PROJECT_NEED_DEL_POST: "/_tech/project/project-need/del.json", // 项目需求-删除
	_TECH_PROJECT_NEED_RATE_ADD_POST: "/_tech/project/project-need/rate-add.json", // 项目进度-新增
	_TECH_PROJECT_NEED_RATE_UPDATE_POST: "/_tech/project/project-need/update-need-rate.json", // 项目需求 - 修改进度
	_TECH_PROJECT_NEED_RATE_DEL_POST: "/_tech/project/project-need/rate-del.json", // 项目进度删除
	_TECH_PROJECT_NEED_IMPORT_POST: "/_tech/project/project-need/import-project-need.json", // 项目需求导入


	_TECH_PROJECT_NEED_RATE_LIST_GET: "/_tech/project/project-need/rate-list.json", // 项目进度列表
	_TECH_PROJECT_SCHEDULE_LIST_GET: "/_tech/project/project-schedule/list.json", // 项目值班-列表
	_TECH_PROJECT_NEED_RATE_TAB_LIST_GET: "/_tech/project/project-need/rate-tab.json", // 需求进度tab列表
	_TECH_PROJECT_NEED_DOWNLOAD_TEMPLATE_GET: "/_tech/project/project-need/download-template.json", // 项目需求 - 下载导入模板


	TECH_PROJECT_PLAN_OVERVIEW_LIST_GET: '/_tech/project/project/list.json', // 项目总览-列表
	TECH_PROJECT_PLAN_DEMAND_LIST_GET: '/_tech/project/project-need/list.json', // 项目需求列表
	TECH_SHARE_PROGRESS_LIST_GET: "/_tech/project/project-need/rate-index.json", // 需求进度-列表
	TECH_PROJECT_PUBLISH_NOTICE_LIST_GET: '/_tech/project/project-notice/list.json', // 更新通知列表
	_TECH_PROJECT_PUBLISH_NOTICE_DOWN_POST: '/_tech/project/project-notice/under.json', // 更新通知下架
	_TECH_PROJECT_PUBLISH_NOTICE_UP_POST: '/_tech/project/project-notice/publish.json', // 更新通知上架
	_TECH_PROJECT_PUBLISH_NOTICE_DELETE_POST: '/_tech/project/project-notice/delete.json', // 更新通知删除
	_TECH_PROJECT_PUBLISH_NOTICE_SAVE_POST: '/_tech/project/project-notice/save.json', // 更新通知保存
	_TECH_PROJECT_PUBLISH_NOTICE_INFO_GET: '/_tech/project/project-notice/detail.json', // 更新通知详情
	_TECH_PROJECT_PUBLISH_NOTICE_PROJECT_LIST_GET: '/_tech/project/project/project-list.json', // 项目列表
	TECH_PROJECT_PUBLISH_DOCUMENT_LIST_GET: '/_tech/project/project-function-read/list.json',
	_TECH_PROJECT_PUBLISH_DOCUMENT_DOWN_POST: '/_tech/project/project-function-read/under.json', // 功能解读下架
	_TECH_PROJECT_PUBLISH_DOCUMENT_UP_POST: '/_tech/project/project-function-read/put-away.json', // 功能解读上架
	_TECH_PROJECT_PUBLISH_DOCUMENT_DELETE_POST: '/_tech/project/project-function-read/delete.json', // 功能解读删除
	_TECH_PROJECT_PUBLISH_DOCUMENT_SAVE_POST: '/_tech/project/project-function-read/add.json', // 功能解读保存
	_TECH_PROJECT_PUBLISH_DOCUMENT_INFO_GET: '/_tech/project/project-function-read/detail.json', // 功能解读详情

	_TECH_PROJECT_PUBLISH_DOCUMENT_TREE_GET: '/_tech/project/project-function-read/project-read-document-tree.json', // 功能解读树状


	/**
	 * 类目管理
	 */
	TECH_PROJECT_PUBLISH_DOCUMENT_CATEGORY_LIST_GET: '/_tech/project/project-document/list.json',
	
	_TECH_PROJECT_PUBLISH_PRODUCTMENT_DOCUMENT_LIST_POST: '/_tech/project/project-document/add.json', // 项目类目-新增、修改
	_TECH_PROJECT_PUBLISH_PRODUCTMENT_DOCUMENT_DEL_POST: '/_tech/project/project-document/del.json', // 项目类目-删除

	/**
	 * 更新通知
	 */
	_TECH_SHARE_NOTICE_GET: '/_tech/project/project-notice/project-list.json', // （首页）更新通知-项目
	_TECH_SHARE_NOTICE_LIST_GET: '/_tech/project/project-notice/notice-list.json', // （首页）更新通知 - 项目下通知
	_TECH_SHARE_NOTICE_DETAIL_GET: '/_tech/project/project-notice/detail.json', // 更新通知 - 详情

	/**
	 * 功能解读
	 */

	_TECH_SHARE_DOCUMENT_RED_TREE_GET: '/_tech/project/project-function-read/project-read-document-tree.json', // 首页功能解读 -- 类目树状列表
	_TECH_SHARE_DOCUMENT_READ_GET: '/_tech/project/project-function-read/document-read.json', // 首页功能解读--- 类目下的功能解读

	/**      
	 *  项目值班
	 */
	_TECH_PROJECT_PLAN_DUTY_PROJECT_LIST_GET: '/_tech/project/project/list.json', // 项目总览-列表
	_TECH_PROJECT_PLAN_DUTY_PROJECT_DETAIL_GET: '/_tech/project/project-schedule/list.json', // 项目值班-列表
	_TECH_PROJECT_PLAN_DUTY_EDIT_CAL_POST: '/_tech/project/project-schedule/edit-schedule.json', // 编辑单个项目值班
	_TECH_PROJECT_PLAN_DUTY_EDIT_SCHEDULE_POST: '/_tech/project/project-schedule/add.json', // 项目排班-新增、修改
	_TECH_PROJECT_PLAN_WORK_TABLE_GET: '/_tech/project/project/index.json', // 首页组件
};
export default api;
