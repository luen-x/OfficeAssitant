const api = {
	/**
	 * 请注释模块内容
	 */

	 /**
	 * 销售数据
	 */
	STATISTIC_BUSINESS_SALE_GET: '',

	// 公司目标
	_STATISTIC_BUSINESS_SALE_TARGET_GET: '/_sale/sale/statistics-achievement/target.json',

	// 王中王看板
	// 王中王 - 获取周期
	_STATISTIC_BUSINESS_SALE_CYCLE_GET: '/_sale/sale/system/get-cycle.json',
	// 王中王 - 月度年度列表
	_STATISTIC_BUSINESS_SALE_KING_GET: '/_sale/sale/statistics-achievement/king-list.json',
	// 王中王 - 周期设置
	_STATISTIC_BUSINESS_SALE_KING_SAVE_POST: '/_sale/sale/system/cycle-save.json',
	// 王中王 - 关闭周期
	_STATISTIC_BUSINESS_SALE_KING_DELETE_POST: '/_sale/sale/system/cycle-delete.json',
	// 销售数据 - 业绩排行
	_STATISTIC_BUSINESS_SALE_RANKING_GET: '/_sale/sale/statistics-achievement/ranking.json',
	// 产品成本统计柱状图
	_STATISTIC_BUSINESS_SALE_COST_GET: '/_finance/finance/cost/depart-statistics.json',
	// 退款统计--按退款类型
	_STATISTIC_BUSINESS_SALE_REFUND_TYPE_GET: '/_finance/finance/refund/refund-type-statistics.json',
	// 退款统计--原因大类
	_STATISTIC_BUSINESS_SALE_REFUND_REASON_GET: '/_finance/finance/refund/refund-reason-type-statistics.json',
	// 退款原因 - 树状结构
	_STATISTIC_BUSINESS_SALE_REFUND_TREE_GET: '/_cms/setting/refund/tree.json',
	// 退款统计--退款原因
	_STATISTIC_BUSINESS_SALE_REFUND_STATISTICS_GET: '/_finance/finance/refund/reason-statistics.json',
	// 退款统计--产品类型
	_STATISTIC_BUSINESS_SALE_REFUND_CATEGORY_GET: '/_finance/finance/refund/refund-reason-product-category-statistics.json',
	// 退款统计-产品
	_STATISTIC_BUSINESS_SALE_REFUND_PRODUCT_GET: '/_finance/finance/refund/reason-product-statistics.json',
	// 产品成本统计柱状图列表导出
	_STATISTIC_BUSINESS_SALE_EXPORT_GET: '/_finance/finance/cost/depart-statistics-export.json',
	STATISTIC_BUSINESS_CUSTOMER_GET: '',
	STATISTIC_BUSINESS_CUSTOMER_DEAL_GET: '',
	STATISTIC_BUSINESS_CUSTOMER_DEAL_LIST_GET: '/list',
	STATISTIC_BUSINESS_SALE_RANK_GET: '',
	// 业绩排名 - 战区部门员工排名列表
	STATISTIC_BUSINESS_SALE_RANK_LIST_GET: '/_sale/sale/statistics-achievement/zone-ranking.json',
	STATISTIC_BUSINESS_SALE_RANK_DEPART_GET: '',

	STATISTIC_BUSINESS_SALE_RANK_DEPART_LIST_GET: '/_sale/sale/statistics-achievement/zone-ranking.json',
	STATISTIC_BUSINESS_SALE_RANK_STAFF_GET: '',
	// 业绩排名 - 员工详情
	STATISTIC_BUSINESS_SALE_RANK_STAFF_LIST_GET: '/_sale/sale/statistics-achievement/staff-detail.json',
	// 产品成本统计列表
	STATISTIC_BUSINESS_SALE_COST_GET: '',
	STATISTIC_BUSINESS_SALE_COST_LIST_GET: '/_finance/finance/cost/list.json',
	// 产品统计列表产品详情
	_STATISTIC_BUSINESS_SALE_COST_PRODUCT_LIST_GET: '/_finance/finance/cost/product-list.json',
	STATISTIC_BUSINESS_SALE_REFUND_GET: '',
	STATISTIC_BUSINESS_SALE_REFUND_LIST_GET: '/_finance/finance/refund/list-statistics.json',

	//  成交客户统计-按行业、区域、按类型、按折扣-列表
	STATISTIC_BUSINESS_CUSTOMER_DEAL_INDUSTRY_LIST_GET: '/_sale/sale/statistics-deal-customers/customer-statistics-public-detail.json',
	STATISTIC_BUSINESS_CUSTOMER_DEAL_AREA_LIST_GET: '/_sale/sale/statistics-deal-customers/customer-statistics-public-detail.json',
	STATISTIC_BUSINESS_CUSTOMER_DEAL_TYPE_LIST_GET: '/_sale/sale/statistics-deal-customers/customer-statistics-public-detail.json',
	STATISTIC_BUSINESS_CUSTOMER_DEAL_DISCOUNT_LIST_GET: '/_sale/sale/statistics-deal-customers/customer-statistics-discount-detail.json',
	STATISTIC_BUSINESS_CUSTOMER_RENEW_GET: '',

	_STATISTIC_BUSINESS_CUSTOMER_DEAL_INDUSTRY_GET: "/_sale/sale/statistics-deal-customers/customer-statistics-by-industry.json",
	_STATISTIC_BUSINESS_CUSTOMER_DEAL_AREA_GET: "/_sale/sale/statistics-deal-customers/customer-statistics-by-area.json",
	_STATISTIC_BUSINESS_CUSTOMER_DEAL_TYPE_GET: "/_sale/sale/statistics-deal-customers/customer-statistics-by-type.json",
	_STATISTIC_BUSINESS_CUSTOMER_DEAL_DISCOUNT_GET: "/_sale/sale/statistics-deal-customers/customer-statistics-by-discount.json",
	STATISTIC_BUSINESS_CUSTOMER_RENEW_LIST_GET: '/_sale/sale/renew/customer-statistics-zone.json', // 续费客户-战区排名
	STATISTIC_BUSINESS_CUSTOMER_RENEW_LIST2_GET: '/_sale/sale/renew/customer-statistics-depart.json', // 续费客户-部门排名
	STATISTIC_BUSINESS_CUSTOMER_RENEW_LIST3_GET: '/_sale/sale/renew/customer-statistics-personal.json', // 续费客户-个人排名
	STATISTIC_BUSINESS_CUSTOMER_RENEW_STAFF_LIST_GET: '/_sale/sale/renew/get-staff-renew-amount-list.json', // 续费客户-个人续费客户
	STATISTIC_BUSINESS_CUSTOMER_REBUY_LIST_GET: '/_sale/sale/repeat/customer-statistics-zone.json', // 复购客户-战区排名
	STATISTIC_BUSINESS_CUSTOMER_REBUY_LIST2_GET: '/_sale/sale/repeat/customer-statistics-depart.json', // 复购客户-部门排名
	STATISTIC_BUSINESS_CUSTOMER_REBUY_LIST3_GET: '/_sale/sale/renew/customer-statistics-personal.json', // 复购客户-个人排名
	STATISTIC_BUSINESS_CUSTOMER_REBUY_STAFF_LIST_GET: '/_sale/sale/repeat/get-staff-repeat-amount-list.json', // 复购客户-个人复购客户
	STATISTIC_BUSINESS_CUSTOMER_REPRODUCT_LIST_GET: "/_sale/sale/renew/statistics-customer-by-product.json", // 续费产品-产品
	STATISTIC_BUSINESS_CUSTOMER_REPRODUCT_ZONE_LIST_GET: '/_sale/sale/renew/statistics-customer-by-zone.json', // 续费产品-战区
	_STATISTIC_BUSINESS_CUSTOMER_REBUY_EXPORT_GET: "/_sale/sale/repeat/export-zone-repeat.json", // 复购客户-战区排名 导出
	_STATISTIC_BUSINESS_CUSTOMER_RENEW_EXPORT_GET: "/_sale/sale/renew/export-zone-renew.json", // 续费客户-战区排名 导出
	_STATISTIC_BUSINESS_CUSTOMER_DEAL_TOTAL_GET: "/_sale/sale/statistics-deal-customers/statistics-total.json", // 成交数据统计-头部
	_STATISTIC_BUSINESS_CUSTOMER_DEAL_PAYMENT_GET: "/_sale/sale/statistics-deal-customers/customer-trade-sort.json", // 成交金额排名
	_STATISTIC_BUSINESS_CUSTOMER_DEAL_CUSTOMER_GET: "/_sale/sale/statistics-deal-customers/deal-customer-statistics.json", // 成交客户
	STATISTIC_BUSINESS_CUSTOMER_REPRODUCT_GET: '',
	// 产品成本统计配置--列表
	STATISTIC_CONFIG_COST_GET: '',
	STATISTIC_CONFIG_COST_LIST_GET: '/_cms/product/product-statistics-set/list.json',
	// 产品成本统计配置--编辑
	_STATISTIC_CONFIG_COST_EDIT_POST: '/_cms/product/product-statistics-set/edit.json',
	// 产品成本统计配置--产品选择框
	_STATISTIC_CONFIG_COST_PRODUCT_LIST_GET: '/_cms/product/product-statistics-set/product-list.json',
	// 产品成本统计配置--关联
	_STATISTIC_CONFIG_COST_RELATION_POST: '/_cms/product/product-statistics-set/relation.json',
	// 退款原因 - 列表
	STATISTIC_CONFIG_REASON_GET: '',
	STATISTIC_CONFIG_REASON_LIST_GET: '/_cms/setting/refund/reason-list.json',
	// 退款原因 - 列表
	_STATISTIC_CONFIG_REASON_CATEGORY_LIST_GET: '/_cms/setting/refund/category-list.json',
	// 原因大类 - 设置
	_STATISTIC_CONFIG_REASON_CATEGORY_SAVE_POST: '/_cms/setting/refund/category-save.json',
	// 退款原因 - 保存
	_STATISTIC_CONFIG_REASON_REFUND_SAVE_POST: '/_cms/setting/refund/save.json',
	// 删除
	_STATISTIC_CONFIG_REASON_REFUND_CAN_DELETE_POST: '/_cms/setting/refund/can-delete.json',
	// 退款原因 - 删除/恢复
	_STATISTIC_CONFIG_REASON_REFUND_DELETE_POST: '/_cms/setting/refund/delete.json',
	STATISTIC_CONFIG_REASON_RECYCLE_GET: '',
	STATISTIC_CONFIG_REASON_RECYCLE_LIST_GET: '/_cms/setting/refund/reason-list.json',
	STATISTIC_BUSINESS_CUSTOMER_RENEW_DEPART_GET: '',
	STATISTIC_BUSINESS_CUSTOMER_RENEW_DEPART_LIST_GET: '/list',
	STATISTIC_BUSINESS_CUSTOMER_REBUY_DEPART_GET: '',
	STATISTIC_BUSINESS_CUSTOMER_REBUY_DEPART_LIST_GET: '/list'
};

export default api;
