const api = {
	/**
	 * 公共的api
	 */
	_COMMON_REGION_GET: '/_public/api/region/tree.json', // 获取省市区地址
	_AUTH_ROLE_LIST_GET: '/_auth/auth/role/list.json',
	_COMMON_SMS_SEND_GET: '/_public/api/sms/send.json', // 获取短信验证码
	// 二级地址
	_COMMON_SECOND_REGION_GET: '/_public/api/region/tree.json',
	// 获取oss签名
	_COMMON_OSS_SIGNATURE_GET: '/_cms/api/image/get-oss-info.json',
	// 下载oss文件
	_COMMON_OSS_DOWNLOAD_GET: "/_cms/api/download/download.json",
	// 下载文件
	_COMMON_DOWNLOAD_FILE_GET: '/_cms/download/download.json',
	// pc消息列表接口
	_COMMON_NOTICE_GET: '/_notice/notice/pc-notice/get-pc-notice-list.json',
	// pc消息设置已读
	_COMMON_NOTICE_SET_READ_POST: '/_notice/notice/pc-notice/save-read.json',
	_NOTICE_INFO_LIST_GET: '/_notice/notice/pc-notice/get-notice-info.json',
	_NOTICE_ALL_READ_POST: '/_notice/notice/pc-notice/save-all-read.json',
	_NOTICE_ALL_DELETE_POST: '/_notice/notice/pc-notice/delete.json',
	_COMMON_SOCKET_BIND_GET: '/_notice/notice/socket/bind.json',
	_NOTICE_NO_READ_COUNT_GET: '/_notice/notice/pc-notice/get-no-read-count.json',
	// 录入到帐全局通知
	_NOTICE_IN_COUNT_GET: '/_notice/notice/pc-notice/get-alert-notice.json',
	// 录入到帐标记通知已读
	_NOTICE_READED_COUNT_POST: '/_notice/notice/pc-notice/marked-read.json',

	// 下载文件
	_TOOLKIT_DOWNLOAD_RECORD_POST: '/_cms/download/material-download/create.json',
	_TOOLKIT_DOWNLOAD_RECORD_LIMIT_POST: '/_cms/download/warning-rule/limit-notice.json',

	// 工具包
	_TOOLKIT_KIT_CATEGORY_ALL_GET: '/_cms/toolkit/kit-category/all.json', // 类目
	_TOOLKIT_KIT_MATERIAL_FILE_LIST_GET: '/_cms/toolkit/kit-material/file-list.json', // 列表
	_TOOLKIT_KIT_MATERIAL_DETAIL_GET: '/_cms/toolkit/kit-material/detail.json', // 素材详情
	_TOOLKIT_KIT_BROWSE_LIST_GET: "/_cms/toolkit/kit-browse/list.json", // 浏览历史
	_TOOLKIT_KIT_BROWSE_BROWSE_CREATE_POST: '/_cms/toolkit/kit-browse/create.json', // 添加浏览记录
	_COMMON_REGION_AREA_MAP_GET: "/_public/api/region/get-area-mapping.json"

	


};
export default api;
