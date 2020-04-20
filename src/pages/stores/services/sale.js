
import { initTreeData } from '@utils/utils';
import { createService, serviceObj, serviceCompare } from './utils';

const formatRefundReason = (arr) => {
	const target = arr.map(it => {
		const result = {
			title: it.reason_name || it.reason_category_name,
			value: it.reason_id || ('category_id' + it.reason_category_id),
			checked: false,
			children: it.reason_list,
		};
		if (result.children && result.children.length > 0) {
			result.children = formatRefundReason(result.children);
		} else {
			delete result.children;
		}
		return result;
	});
	return target;
};
export const services = {
	// 行业列表
	...createService({
		key: "industryList",
		url: '_SALE_INTENTION_INDUSTRY_LIST_GET',
	}),
	// 公司规模
	...createService({
		key: "scaleList",
		url: "_SALE_INTENTION_SCALE_LIST_GET",
	}),
	// 我方合同公司列表
	...createService({
		key: "ourContractCompanys",
		url: "_SALE_PAYMENT_OUR_CONTRACT_COMPANY_GET",
	}),
	// 支付方式列表
	...createService({
		key: "payMethods",
		url: "_SALE_SALE_PAYMENT_PAYMENT_METHOD_LIST_GET",
		parser:	data => {
			data.forEach(item => {
				item.value = item.method_id;
				item.label = item.method_name;
				item.children = item.children || [];
				item.children.forEach(it => {
					it.value = it.item_id;
					it.label = it.item_name;
				});

			});
			return data;
		}
	}),
	// 产品分类列表
	...createService({
		key: "productTypeList",
		url: "_SALE_SALE_PRODUCT_CATEGORY_LIST_GET",
	}),

	// 全部部门
	...createService({
		key: "departAll",
		url: "_HR_DEPART_ALL_GET",
		parser: data => initTreeData(data, "depart_id", "depart_name", "child")
	}),
	// 我的下级部门
	...createService({
		key: "departMy",
		url: "_HR_DEPART_ALL_GET",
		parser: data => {
			if (Array.isArray(data)) {
				return initTreeData(data, "depart_id", "depart_name", "child");
			} else {
				return [];
			}
		},
		getParam: (instance) => ({ depart_id: instance.$global.staff.depart_id })
	}),
	// 我的下级部门员工
	...createService({
		key: "departMyStaff",
		url: "_HR_DEPART_STAFF",
		getParam: (instance) => ({ depart_id: instance.$global.staff.depart_id }),
		parser: data => {
			if (!Array.isArray(data)) return [];
			data = JSON.parse(JSON.stringify(data));
			const needKeys = ['children', 'label', 'value'];
			const formatDepart = arr => {
				arr.forEach(depart => {
					depart.children = [...(depart.children || []), ...(depart.staff || [])];
					depart.label = depart.staff_id ? depart.staff_name : depart.depart_name;
					depart.value = depart.depart_id + '-' + (depart.staff_id || '');
					Object.keys(depart).forEach(key => {
						if (!needKeys.includes(key)) {
							delete depart[key];
						}
					});
					if (depart.children.length) {
						formatDepart(depart.children);
					}
				});
			};
			formatDepart(data);
			return data;
			
		}
	}),
	// 三级地区
	...createService({
		key: "region3",
		url: "_COMMON_REGION_GET",
		cache: true,
		parser: data => initTreeData(data, "national_code", "region_name", "children")
	}),
	// 一级部门name-id枚举
	...createService({
		key: "firstDepartId",
		url: "_HR_HUMAN_FIRST_DEPART_ID_GET",

	}),
	...createService({
		key: 'paymentLabel',
		url: "_SALE_PAYMENT_PAYMENT_LABEL",
	}),
	...createService({
		key: 'customerTypeList',
		url: "_SALE_CUSTOMER_CUSTOMER_TYPE_LIST_GET",
	}),
	...createService({
		key: 'industryTree',
		url: "_SALE_CUSTOMER_INDUSTRY_TREE_GET",
		parser: data => initTreeData(data, "industry_id", "industry_name", "children")
	}),
	...createService({
		key: 'roleList',
		url: "_SALE_CUSTOMER_ROLE_LIST_GET",
		parser: data => initTreeData(data, "industry_id", "industry_name", "child")
	}),
	...createService({
		key: 'coinConfig', // 微币奖惩配置
		url: "_SALE_PROPERTY_SETTING_TIPS_GET",
		parser: data => {
			const result = {};
			data.forEach(i => {
				result['tip_' + i.scene + '_' + i.check] = i.tips;
			});
			return result;
		}
	}),
	...createService({
		key: 'signCustomerConfig', // 领取客户配置
		url: "",
		
	}),
	...createService({
		key: 'editCustomerConfig', // 编辑客户配置
		url: "_SALE_CUSTOMER_EDIT_CONFIG_GET",
		parser: data => {
			const result = { private_fields: {}, normal_fields: {} };
			
			data.private_fields.edit_show.forEach(item => {
				result.private_fields[item.key] = { show: true, required: !item.is_optional };
			});
			result.private_fields.showLength = data.private_fields.edit_show.length;
			data.private_fields.edit_hide.forEach(item => {
				result.private_fields[item.key] = { show: false, required: !item.is_optional };
			});

			data.normal_fields.edit_show.forEach(item => {
				result.normal_fields[item.key] = { show: true, required: !item.is_optional };
			});
			result.normal_fields.showLength = data.normal_fields.edit_show.length;
			data.normal_fields.edit_hide.forEach(item => {
				result.normal_fields[item.key] = { show: false, required: !item.is_optional };
			});
			return result;
		}
	}),
	...createService({
		key: 'otherConfig', // 其他设置（时间限制）
		url: "_SALE_CUSTOMER_SYSTEM_OTHER_CONFIG_GET",
		
	}),
	...createService({
		key: 'propertyConfig', // 道具配置
		url: "_SALE_CUSTOMER_EDIT_CONFIG_GET",
	}),
	...createService({
		key: 'weAgeList', // 客户微龄
		url: "_SALE_CUSTOMER_CASE_AGE_LIST_GET",
	}),
	...createService({
		key: 'customerProductType', // 客户微龄
		url: "_ACADEMY_SUPPORT_CASE_PRODUCT_TYPE_GET",
	}),
	...createService({
		key: 'targetSeason', // 季度目标转为树结构
		url: "_SALE_MAIN_TARGET_CONFIG_GET",
	}),
	...createService({
		key: 'areaTree', // 地域
		url: "",
		
	}),
	...createService({ // 所有员工
		key: 'staffList',
		url: "_SALE_PAYMENT_STAFF_LIST_GET",
		param: {
			search: '',
			is_page: 0, // 不分页
			is_charge: 0, // 不包含超管
			is_leave: 1 // 包含离职
		},
		parser: data => data.list
	}),
	...createService({ // 退款原因
		key: 'refundReasonTree',
		url: "_SALE_CUSTOMER_DEAL_REFUND_REASON_TREE_GET",
		parser: formatRefundReason
	}),
	

	

	
	
};
