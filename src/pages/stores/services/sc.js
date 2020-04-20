import API_ROOT from '@stores/apis/root';
import { initTreeData } from '@utils/utils';
import { createService, serviceObj, serviceCompare } from './utils';

/**
 * 用于缓存，此数据不经过redux缓存，暂时不涉及增删改
 */

export const services = {
	// 公司下的所有部门
	...createService({
		key: "departAll",
		url: '_SC_CUSTOMER_REFUND_DEPARTMENTS_GET',
		parser: (data) => initTreeData(data, 'depart_id', 'depart_name', 'child'),
		param: { depart_id: 11 }
	}),
	...createService({
		key: "allRegion",
		url: '_COMMON_REGION_GET',
		parser: (data) => initTreeData(data, 'national_code', 'region_name', 'child')
	})
};