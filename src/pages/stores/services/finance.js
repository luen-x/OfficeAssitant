import { initTreeData } from '@utils/utils';
import { createService, serviceObj, serviceCompare } from './utils';

export const services = {
	...createService({
		key: "payMethod",
		url: '_FINANCE_CUSTOMER_ACHI_CHANGE_PAYMENT_GET',
		parser: (data) => {
			data = initTreeData(data, 'method_id', 'method_name');
			data = initTreeData(data, 'item_id', 'item_name');
			return data;
		}
	}),
	...createService({
		key: "departArr",
		url: "_HR_DEPART_ALL_GET",
		parser: (data) => initTreeData(data, 'depart_id', 'depart_name', 'child')
	})
};
