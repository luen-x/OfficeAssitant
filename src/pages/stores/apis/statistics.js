const api = {
	/**
	 * 请注释模块内容
	 */
	STATISTICS_CUSTOMER_DISTRIBUTION_GET: '',
	STATISTICS_DEAL_CUSTOMER_GET: '',
	_STATISTICS_DEAL_REFUND_COUNT_GET: '/_sale/sale/statistics-deal-customer/refund-count.json',
	_STATISTICS_DEAL_REFUND_MONY_GET: '/_sale/sale/statistics-deal-customer/refund-money.json',
	_STATISTICS_DEAL_SWITCH_GET: '/_sale/sale/statistics-customer/turn-over-rate.json',
	STATISTICS_QUALITY_RANK_GET: '',

	/**
	 * 成交客户统计
	 */
	STATISTICS_DEAL_CUSTOMER_STAFF_GET: '/_sale/sale/statistics-deal-customer/staff-deal-customer.json',
	STATISTICS_DEAL_CUSTOMER_DEPARTMENT_GET: '/_sale/sale/statistics-deal-customer/depart-deal-customer.json',
	STATISTICS_DEAL_CUSTOMER_AREAS_GET: '/_sale/sale/statistics-deal-customer/war-zone-deal-customer.json',
	STATISTICS_DEAL_CUSTOMER_TABLE_GET: '/_sale/sale/statistics-deal-customer/deal-customer-statistics.json',

	/**
	 * 客户分布统计 ---- 员工客户统计
	 */
	STATISTICS_CUSTOMER_INDUSTRY_GET: '/_sale/sale/statistics-customer/industry.json', // 行业分布-已成交/未成交
	STATISTICS_CUSTOMER_DISTRIBUTIONS_GET: '/_sale/sale/statistics-customer/distribution.json', // 客户分布统计
	STATISTICS_CUSTOMER_TYPES_GET: '/_sale/sale/statistics-customer/customer.json', // 员工客户统计（客户类型统计）
	STATISTICS_CUSTOMER_SEDIMENTARY_GET: '/_sale/sale/statistics-customer/sedimentary.json', // 沉积客户统计
	STATISTICS_CUSTOMER_EMPLOYEE_TYPE_GET: '',
	_STATISTICS_CUSTOMER_EMPLOYEE_TYPE_GET: '/_sale/sale/statistics-customer/customer.json',
	STATISTICS_CUSTOMER_EMPLOYEE_NEW_GET: '',
	STATISTICS_CUSTOMER_EMPLOYEE_NEW_STAFF_GET: '/_sale/sale/statistics-customer/staff-customer.json',
	STATISTICS_CUSTOMER_EMPLOYEE_NEW_DEPARTMENT_GET: '/_sale/sale/statistics-customer/depart-customer.json',
	STATISTICS_CUSTOMER_EMPLOYEE_NEW_AREAS_GET: '/_sale/sale/statistics-customer/war-zone-customer.json',



	/**
	 * 质检统计 ---- 质检数据
	 */

	STATISTICS_QUALITY_DATA_GET: '/_sc/center/count/test.json',

	/**
	 * 质检统计 ---- 质检排名
	 */
	STATISTICS_QUEALITY_RANK_GET: '/_sc/center/count/test-data.json',
};
export default api;
