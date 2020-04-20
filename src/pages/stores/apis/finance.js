const api = {
	/**
	 * 请注释模块内容
	 */
	_FINANCE_ACHI_LIST_EXPORT_GET: '/_sale/sale/export/payment-export.json',
	_FINANCE_ELEC_CONTRACT_CUSTOMER_SAVE_POST: '/_sale/sale/electronic-contract/finance-save.json',
	_FINANCE_DISCOUNT_CONTRACT_CUSTOMER_SAVE_POST: '/_sale/sale/discount-contract/finance-save.json',

	FINANCE_CUSTOMER_GET: '',
	FINANCE_COUNT_GET: '',
	FINANCE_BALLOT_GET: '',
	FINANCE_BILL_GET: '',
	FINANCE_CUSTOMER_ACHI_GET: '',
	_FINANCE_MAIN_GET: '/_finance/finance/index/index.json', // 对首页
	FINANCE_MAIN_PLAYMENT_MORE_LIST_GET: '/_finance/finance/index/more-payment-data.json',
	// _FINANCE_MAIN_SCHEDULE_LIST_GET: '/_finance/finance/index/schedule-list.json', // 对首页日程列表
	_FINANCE_MAIN_SCHEDULE_LIST_GET: '/_finance/finance/index/day-schedule.json', // 对首页日程列表

	_FINANCE_MAIN_SAVE_SCHEDULE_POST: '/_finance/finance/schedule/save-schedule.json', // 对首页 新增和编辑
	_FINANCE_MAIN_ACCOMPLISH_POST: '/_finance/finance/schedule/accomplish-schedule.json', // 对首页 完成日程
	_FINANCE_MAIN_DEL_SCHEDULE_POST: '/_finance/finance/schedule/del-schedule.json', // 对首页删除日程

	_FINANCE_MAIN_STATISTIC_GET: '/_finance/finance/index/statistic.json', // 折线图
	FINANCE_CUSTOMER_ACHI_LIST_GET: '/_sale/sale/payment/list.json',
	_FINANCE_CUSTOMER_ACHI_DETAIL_GET: '/_sale/sale/payment/detail.json',
	_FINANCE_CUSTOMER_ACHI_PAYMENT_USE_GET: '/_finance/finance/receive/get-payment-use-detail.json',
	_FINANCE_CUSTOMER_INFO_GET: '/_sale/sale/contract/customer-info.json',
	_FINANCE_CUSTOMER_ACHI_AUDIT_POST: '/_finance/finance/receive/audit.json',
	_FINANCE_PAYMENT_AUDIT_CHECK_GET: '/_sale/sale/payment/audit-check.json',
	_FINANCE_CUSTOMER_ACHI_CHANGE_PAYMENT_GET: '/_sale/sale/payment/payment-method-list.json',
	_FINANCE_CUSTOMER_ACHI_MODIFY_PAYMENT_POST: '/_sale/sale/payment/payment-method-modify.json',
	_FINANCE_CUSTOMER_ACHI_MONGTH_GET: '/_finance/finance/receive/get-month.json',
	FINANCE_CUSTOMER_CONTRACT_GET: '',
	FINANCE_CUSTOMER_CONTRACT_LIST_GET: '/_sale/sale/contract/list.json',
	_FINANCE_CUSTOMER_CONTRACT_LIST_EXPORT: '/_sale/sale/export/contract-export.json',
	_FINANCE_CUSTOMER_CONTRACT_INFO_GET: '/_sale/sale/contract/detail.json',
	_FINANCE_CUSTOMER_CONTRACT_CONTRACT_INFO_GET: '/_finance/finance/contract/get-modify-contract-info.json',
	FINANCE_CUSTOMER_CONTRACT_CONTRACT_MODIFY_POST: '/_finance/finance/contract/modify-contract-info.json',
	_FINANCE_CUSTOMER_CONTRACT_AUDIT_POST: '/_finance/finance/contract/order-audit.json',
	_FINANCE_CUSTOMER_CONTRACT_EDIT_COST_POST: '/_finance/finance/contract/edit-cost.json',
	_FINANCE_CUSTOMER_PROJECT_GET: '/_sale/sale/contract/project.json',
	// _FINANCE_CUSTOMER_INFO_GET: '/_finance/finance/public/customer-info.json',
	_FINANCE_CUSTOMER_ELECTRONIC_GET: '/_sale/sale/electronic-contract/detail.json',
	_FINANCE_CUSTOMER_ELECTRIC_ARCHIVE: '/_finance/finance/electric/archive.json',
	_FINANCE_CUSTOMER_SUPPLEMENT_GET: '/_sale/sale/contract/supplement-list.json',
	_FINANCE_CUSTOMER_DELIVERY_GET: '/_sc/center/project/contract-delivery.json',
	FINANCE_CUSTOMER_ELEC_GET: '',
	FINANCE_CUSTOMER_ELEC_LIST_GET: '/_sale/sale/electronic-contract/list.json',
	_FINANCE_CUSTOMER_ELEC_AUDIT_POST: '/_finance/finance/electric/audit.json',
	FINANCE_CUSTOMER_REFUND_GET: '',
	FINANCE_CUSTOMER_REFUND_LIST_GET: '/_sale/sale/refund/list.json',
	_FINANCE_CUSTOMER_REFUND_INFO_GET: '/_sale/sale/refund/detail.json',
	_FINANCE_CUSTOMER_REFUND_RECEIVE_GET: '/_sale/sale/deal-customer/customer-company-payment-list.json',
	_FINANCE_CUSTOMER_PAYMENT_SHARE_GET: '/_sale/sale/payment/payment-share.json',
	_FINANCE_CUSTOMER_REFUND_TYPE_INFO_GET: '/_sale/sale/refund/refund-info.json',
	_FINANCE_CUSTOMER_CONTRACT_AUDIT_GET: '/_sale/sale/contract/audit-info.json',
	_FINANCE_CUSTOMER_REFUND_MONEY_INFO_GET: '/_finance/finance/contract/money-info.json',
	_FINANCE_CUSTOMER_REFUND_MONEY_AUDIT_POST: '/_finance/finance/refund/refund-audit.json',
	FINANCE_CUSTOMER_NEGO_GET: '',
	FINANCE_CUSTOMER_NEGO_LIST_GET: '/_sale/sale/deal-customer/list.json',
	_FINANCE_CUSTOMER_NEGO_DETAIL_GET: '/_sale/sale/deal-customer/detail.json',
	_FINANCE_CUSTOMER_NEGO_DETAIL_RECORD_GET: '/_sale/sale/deal-customer/change-log.json',
	FINANCE_CUSTOMER_NEGO_DETAIL_ACHI_LIST_GET: '/_sale/sale/deal-customer/payment-list.json',
	FINANCE_CUSTOMER_NEGO_DETAIL_CUSTOMER_LIST_GET: '/_sale/sale/deal-customer/contract-list.json',
	FINANCE_CUSTOMER_NEGO_DETAIL_REFUND_LIST_GET: '/_sale/sale/deal-customer/refund-list.json',
	FINANCE_CUSTOMER_NEGO_DETAIL_TICKET_LIST_GET: '/_sale/sale/deal-customer/invoice-record.json',
	_FINANCE_CUSTOMER_PAYMENT_DETAIL_GET: '/_finance/finance/payment/detail.json',
	FINANCE_CUSTOMER_REMAIN_GET: '',
	FINANCE_CUSTOMER_REMAIN_LIST_GET: '/_finance/finance/pocket/change-list.json', // 余额变更列表
	_FINANCE_CUSTOMER_REMAIN_AUDIT_GET: '/_finance/finance/pocket/audit.json', // 余额变更--审核
	_FINANCE_CUSTOMER_REMAIN_CHANGE_INFO_GET: '/_finance/finance/pocket/change-info.json', // 余额更改列表-详情
	FINANCE_COUNT_STAFF_GET: '',
	FINANCE_COUNT_STAFF_LIST_GET: '/_finance/finance/commission/staff.json', // 业绩统计—员工业绩列表
	_FINANCE_FIRST_DEPART_GET: '/_hr/human/depart/get-top-departs.json', 
	_FINANCE_FIRST_DEPART_SON_TREE_GET: '/_hr/human/depart/get-first-depart-son-tree.json',
	
	
	FINANCE_COUNT_STAFF_COLLAGE_LIST_GET: '/_finance/finance/commission/get-bs-staff-performance.json', // 业绩统计—员工业绩列表
	FINANCE_COUNT_ACHI_GET: '',
	FINANCE_BALLOT_LIST_GET: '/_sale/sale/invoice/list.json',
	_FINANCE_BALLOT_AUDIT_POST: '/_finance/finance/invoice/check.json',
	_FINANCE_CUSTOMER_COMPANY_INFO_GET: '/_sale/sale/intention/customer-info.json',
	_FINANCE_REFUND_AUDIT_INFO_GET: '/_finance/finance/refund/get-refund-audit-info.json',
	_FINANCE_BALLOT_OPEN_POST: '/_sale/sale/invoice/open.json',
	_FINANCE_BALLOT_RECEVIE_POST: '/_sale/sale/invoice/receive.json',
	_FINANCE_BALLOT_DETAIL_GET: '/_sale/sale/invoice/detail.json',
	_FINANCE_BALLOT_STAFFS_GET: '/_hr/human/staff/get-staffs-by-first-depart.json',
	_FINANCE_BALLOT_COMPANYS_GET: '/_hr/api/human/get-contract-company.json',
	FINANCE_BALLOT_SETTING_INFO_POST: '/_hr/auth/finance/auth-conf-set.json',
	_FINANCE_OUR_COMPANY_GET: '/_sale/sale/payment/our-contract-company.json',
	_FINANCE_BALLOT_SETTING_INFO_GET: '/_hr/auth/finance/auth-conf-info.json',
	FINANCE_BILL_IN_GET: '',
	FINANCE_BILL_IN_LIST_GET: '/_finance/finance/commission/income.json',
	FINANCE_BILL_OUT_GET: '',
	FINANCE_BILL_OUT_LIST_GET: '/_finance/finance/commission/outcome.json',
	FINANCE_MAIN_SCHEDULE_GET: '/_finance/finance/index/get-schedules.json', // 获得某月及其前后一个月所有日程
	_FINANCE_COUNT_ACHI_COUNT_POST: '/_finance/finance/commission/count.json', // 业绩统计-四个数
	_FINANCE_COUNT_ACHI_ECHARTS_POST: '/_finance/finance/commission/chart.json', // 业绩统计-柱状图
	_FINANCE_COUNT_ACHI_SORT_GET: '/_finance/finance/commission/sort.json', // 业绩统计-三个表
	_FINANCE_COUNT_STAFF_DETAIL_GET: '/_finance/finance/commission/detail.json', // 业绩统计-八个表
	_FINANCE_COUNT_STAFF_COLLAGE_DETAIL_GET: '/_finance/finance/commission/get-bs-staff-base-performance-info.json', // 商学院业绩统计-八个表
	FINANCE_COUNT_STAFF_DETAIL_SORT_SUPER_LIST_GET: '/_finance/finance/commission/sort-super.json', // 业绩统计-三个表(第一个表)
	FINANCE_COUNT_STAFF_DETAIL_SORT_DEPART_LIST_GET: '/_finance/finance/commission/sort-depart.json', // 业绩统计-三个表(第二个表)
	FINANCE_COUNT_STAFF_DETAIL_SORT_STAFF_LIST_GET: '/_finance/finance/commission/sort-staff.json', // 业绩统计-三个表(第三个表)
	FINANCE_COUNT_STAFF_DETAIL_ALL_LIST_GET: '/_finance/finance/commission/all-list.json', // 到账记录
	FINANCE_COUNT_STAFF_DETAIL_LIST_GET: '/_finance/finance/commission/account.json', // 到账记录
	_FINANCE_DEAL_EXPORT_LIST_GET: '/_finance/finance/deal-customer/export-list.json',

	_FINANCE_INVOICE_BALLOT_EDIT_POST: '/_sale/sale/invoice/create-and-edit.json', // 编辑开票详情,
	FINANCE_CUSTOMER_SUPPLEMENT_GET: '',

	FINANCE_CUSTOMER_SUPPLEMENT_LIST_GET: '/_sale/sale/supplement/list.json', // 补款审核列表
	_FINANCE_CUSTOMER_SUPPLEMENT_INFO_GET: '/_sale/sale/supplement/info.json', // 补款信息tab
	_FINANCE_CUSTOMER_CHANGE_PAYMENTS_GET: '/_finance/finance/contract/change-using-payments.json', // 更改余额使用
	_FINANCE_CUSTOMER_CHANGE_PAYMENTS_LIST_GET: '/_finance/finance/contract/changeable-payments-list.json', // 更改余额使用列表
	_FINANCE_CUSTOMER_CONTRACT_COST_INFO_GET: '/_finance/finance/contract/contract-cost-info.json', // 编辑成本获取
	_FINANCE_CUSTOMER_CONTRACT_COST_CHANGE_GET: '/_finance/finance/contract/change-cost.json', // 编辑成本更改
	_FINANCE_CUSTOMER_PRODUCT_INFO_GET: '/_finance/finance/project/detail.json', // 修改成本获取产品信息

	_FINANCE_CUSTOMER_CONTRACT_CAHNGE_RECORD_GET: '/_finance/finance/project/change-record.json', // 产品更换记录信息
	_FINANCE_CUSTOMER_CONTRACT_AUDIT_INFO_GET: '/_finance/finance/contract/contract-audit-info.json', // 通过审核获取信息

	// 服务提成
	// 服务提成列表
	FINANCE_SERVICES_COMMISSION_LIST_GET: '/_sc/sale/service-amount/staff-list.json',
	_FINANCE_PRODUCT_GET: '/_cms/product/product/all-product.json', // 产品 - 获取产品名称和制作部门
	_FINANCE_SERVICE_AMOUNT_DETAIL_GET: '/_sc/sale/service-amount/get-staff-detail.json', // 服务提成详情
	_FINANCE_SERVICE_DETAIL_STAFF_INFO_GET: '/_sc/sale/service-amount/staff-info.json', // 财务-服务提成-详情
	_FINANCE_SERVICE_DETAIL_QUALITY_RECORD_GET: '/_sc/center/quality/company-quality-record-list.json', // 财务-服务提成-详情
	_FINANCE_SERVICE_DETAIL_RECORD_DERAIL_GET: '/_sc/center/quality/quality-record-detail.json', // 回访跟进详情
	_FINANCE_SERVICE_DETAIL_SERVICE_INFO_GET: '/_sc/center/quality/company-service-info-list.json', // 公司服务情况

	FINANCE_COUNT_STAFF_DETAIL_STAFF_PERFORMANCE_LIST_GET: '/_finance/finance/commission/get-bs-staff-performance-list.json', // 促单业绩列表
	FINANCE_COUNT_STAFF_DETAIL_MANAGE_PERFORMANCE_LIST_GET: '/_finance/finance/commission/get-bs-manage-performance-list.json', // 团队业绩列表
	_FINANCE_COUNT_STAFF_PAYMENT_RECORD_GET: '/_finance/finance/bs-commission/payment-record.json',
	_FINANCE_COUNT_STAFF_EDIT_MINUS_PERFORMANCE_GET: '/_finance/finance/bs-commission/edit-minus-performance.json',
	_FINANCE_COUNT_STAFF_LECTURER_PERFORMANCE_GET: '/_finance/finance/commission/get-bs-lecturer-performance-detail.json',
	_FINANCE_COUNT_STAFF_COMMISSION_GET_REFUND_DETAIL_GET: '/_finance/finance/commission/get-refund-detail-info.json',
	_FINANCE_GET_BS_TWO_DEPART_GET: '/_hr/human/depart/get-bs-two-depart.json',
	_FINANCE_EDIT_PERFORMANCE_INFO_GET: '/_finance/finance/receive/edit-performance-info.json',
	_FINANCE_DETAIL_COMPLAINT_LIST_GET: '/_sc/center/quality/company-complaint-list.json',
	_FINANCE_DETAIL_FEEDBACK_LIST_GET: '/_sc/sale/feedback/get-staff-integral-detail.json',
	FINANCE_LECTURE_LIST_GET: '/_business/lesson/record-list/lecture-list.json',
	_FINANCE_LECTURE_DETAIL_GET: '/_business/lesson/record-list/lecture-detail.json',
	_FINANCE_BS_PERFORMANCE_CHANGE_RECORD_GET: '/_finance/finance/bs-commission/performance-change-record.json',
	_FINANCE_EDIT_PERFORMANCE_EDIT_POST: '/_finance/finance/receive/edit-performance.json',
	_FINANCE_COMMISSION_LIST_EXPORT_GET: '/_sc/sale/service-amount/export-staff-list.json', // 服务提成导出
	_FINANCE_BS_MANAGE_PERFORMANCE_DETAIL_GET: '/_finance/finance/commission/get-bs-manage-performance-detail.json', // 服务提成导出
	
	FINANCE_CONSULTATION_GET: '',
	FINANCE_CUSTOMER_ACHI_EDIT_GET: '',
	FINANCE_CUSTOMER_DISCOUNT_GET: '',
	FINANCE_CUSTOMER_DISCOUNT_LIST_GET: '/_sale/sale/discount-contract/list.json',
	_FINANCE_CUSTOMER_DISCOUNT_AUDIT_POST: '/_sale/sale/discount-contract/audit.json',

	_FINANCE_CUSTOMER_ACHI_HURRY_POST: '/_sale/sale/urge/order.json',
	_FINANCE_BALLOT_RETURN_INVOICE_POST: '/_sale/sale/invoice/return-invoice.json',

	_DINANCE_CONTRACT_PASS_CHECK_GET: "/_sale/sale/contract/product-check.json",
	_FINANCE_CUSTOMER_DISCOUNT_SIGN_POST: "/_sale/sale/discount-contract/discount-tag.json", // 标记打折/取消打折标记
	_FINANCE_CUSTOMER_DISCOUNT_SIGN_RECORD_GET: "/_sale/sale/discount-contract/discount-tag-record.json", // 打折标记记录
	_FINANCE_CUSTOMER_REBUY_SIGN_POST: "/_sale/sale/repeat/tag-repeat-purchase.json", // 标记复购
	_FINANCE_CUSTOMER_REBUY_SIGN_CANCEL_POST: "/_sale/sale/repeat/cancel-tag-repeat-purchase.json", // 取消标记复购
	_FINANCE_CUSTOMER_REBUY_SIGN_RECORD_GET: "/_sale/sale/repeat/get-repeat-tag-record.json", // 复购标记记录
	_FINANCE_CUSTOMER_PROJECT_TAG_GET: "/_sale/sale/repeat/get-contract-tags-detail.json", // 获取标记
	_FINANCE_CUSTOMER_RENEW_SIGN_RECORD_GET: "/_sale/sale/renew/get-renew-tag-record.json", // 获取续费标记记录
	_FINANCE_CUSTOMER_RENEW_SIGN_POST: "/_sale/sale/renew/tag-renew-purchase.json", // 标记续费
	_FINANCE_CUSTOMER_RENEW_SIGN_CANCEL_POST: "/_sale/sale/renew/cancel-tag-renew-purchase.json", // 取消标记复购

	
};

export default api;
