import API_ROOT from '@stores/apis/root';
import { initTreeData } from '@utils/utils';
import { createService, serviceObj, serviceCompare } from './utils';

/**
 * 用于缓存，此数据不经过vuex缓存，暂时不涉及增删改
 */

const formatDepartPosition = (arr, parent) => {
	const target = arr.map(it => {
		const result = {
			title: it.position_name || it.depart_name,
			value: it.position_id ? "position_id-" + it.position_id : it.depart_id,
			checked: false,
			children: [...(it.positions || [])],
			parent_id: it.position_id ? parent.depart_id : ''
		};
		if (result.children.length > 0) {
			result.children = formatDepartPosition(result.children, it);
		} else {
			delete result.children;
		}
		return result;
	});
	return target;
};

// 公司下的所有部门
export const services = {
	...createService({
		key: "customerType",
		url: '_CONTENT_ACTIVITY_AUDIT_CUSTOMER_TYPE_GET',
		// parser: (data) => initTreeData(res.data, 'category_id', 'category_name')
	}),
	...createService({
		key: "allRole",
		url: '_CONTENT_MATERIAL_MANAGE_ALL_ROLE_GET',
	}),
	...createService({
		key: "materialClassAll",
		url: 'CONTENT_MATERIAL_CLASSIFY_LIST_GET'
	}),
	// 内容管理查看职位
	...createService({
		key: "departPosition",
		url: '_HR_DEPART_POSITION_GET',
		parser: formatDepartPosition
		// parser: (data) => initTreeData(initTreeData(data, 'depart_id', 'depart_name', 'positions'), 'position_id', 'position_name')
		// key: "stageTree",
		// url: "_HR_TRAIN_ECHELON_SHOW_ECHELON_LIST_GET",
		// parser: formatStage
	}),
	...createService({
		key: "circleCategoryList",
		url: '_CONTENT_CIRCLE_CATEGORY_GET'
	}),
	
};