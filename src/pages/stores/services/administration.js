import { initTreeData } from '@utils/utils';
import API_ROOT from "@stores/apis/root";
import { createService, serviceObj, serviceCompare } from './utils';

export const services = {
	...createService({
		key: "departArr",
		url: '_ADMINISTRATION_DEPART_GET',
		parser: (data) => initTreeData(data, 'depart_id', 'depart_name', 'child'),
		param: {
			depart_id: _global.staff.depart_id
		}
	}),
	...createService({
		key: "priorityList",
		url: '_ADMINISTRATION_PROORITY_GET'
	}),
	...createService({
		key: "eventTypeList",
		url: '_ADMINISTRATION_EVENT_TYPE_LIST_GET',
	}),
	...createService({
		key: "departAll",
		url: '_HR_DEPART_ALL_GET',
		parser: (data) => initTreeData(data, 'depart_id', 'depart_name', 'child')
	}),
	// 指派部门
	...createService({
		key: "assignDepart",
		url: '_ADMINISTRATION_ASSIGN_DEPART_GET',
		parser: (data) => initTreeData(data, 'depart_id', 'depart_name', 'children'),
		getParam: (instance) => ({ event_id: instance.info.event_id })
	}),
	...createService({
		key: "firstDepart",
		url: '_ADMINISTRATION_FIRST_DEPART_GET',
		parser: (data) => initTreeData(data, 'depart_id', 'depart_name', 'child')
	}),

};

// 查找总负责人
export const searchManager = (opts = {}) => {
	const {
		key,
	} = opts;
	const strFn = key.charAt(0).toUpperCase() + key.slice(1);
	const loadKey = `load${strFn}`;

	return {
		data() {
			return {
				[`${key}Loading`]: false,
				[`${key}Data`]: [],
			};
		},
		mounted() {
			this[`${key}Mounted`] = true;
		},
		methods: {
			[loadKey](query) {
				if (this[`${key}Mounted`]) {
					query = String(this[key]) || query;
				}

				if (query !== '') {
					this[`${key}Loading`] = true;
					this.$request({
						url: API_ROOT._ADMINISTRATION_MANAGER_GET,
						type: 'GET',
						param: {
							search: query.trim().replace(/\(.*?\)/g, '').replace(/（.*?）/g, '')
						},
						loading: false
					}).then((res) => {
						this[`${key}Loading`] = false;
						this[`${key}Data`] = initTreeData(res.data, 'value', 'text');
					}).catch((error) => {
						this[`${key}Loading`] = false;
					}).finally(() => {
						this[`${key}Mounted`] = false;
					});
				} else {
					this[`${key}Data`] = [];
				}
			}
		}
	};
};

// 查找参与人员
export const searchPKStaff = (opts = {}) => {
	const {
		key,
	} = opts;
	const strFn = key.charAt(0).toUpperCase() + key.slice(1);
	const loadKey = `load${strFn}`;

	return {
		data() {
			return {
				[`${key}Loading`]: false,
				[`${key}Data`]: [],
			};
		},
		mounted() {
			this[`${key}Mounted`] = true;
		},
		methods: {
			[loadKey](query) {
				if (this[`${key}Mounted`]) {
					query = String(this[key]) || query;
				}

				if (query !== '') {
					this[`${key}Loading`] = true;
					this.$request({
						url: API_ROOT._ADMINISTRATION_PK_STAFF_GET,
						type: 'GET',
						param: {
							search: query.trim().replace(/\(.*?\)/g, '').replace(/（.*?）/g, '')
						},
						loading: false
					}).then((res) => {
						this[`${key}Loading`] = false;
						this[`${key}Data`] = initTreeData(res.data, 'value', 'text');
					}).catch((error) => {
						this[`${key}Loading`] = false;
					}).finally(() => {
						this[`${key}Mounted`] = false;
					});
				} else {
					this[`${key}Data`] = [];
				}
			}
		}
	};
};
