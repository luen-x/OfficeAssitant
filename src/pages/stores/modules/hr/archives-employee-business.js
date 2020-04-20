import { initPage } from '@utils/utils';
import { cloneDeep } from 'lodash';

const initialState = {
	listInfo: {
		'1': {
			...initPage
		},
		'2': {
			...initPage
		},
	},
	title: {
		'1': {
			title_show: [],
			title_hide: []
		},
		'2': {
			title_show: [],
			title_hide: []
		},
	}
};

const mutations = {
	HR_ARCHIVES_EMPLOYEE_BUSINESS_LIST_CHANGE(state, { page }) {
		state.listInfo = {
			1: {
				...initPage,
				data: {
					[page]: {}
				}
			},
			2: {
				...initPage,
				data: {
					[page]: {}
				}
			}
		};
	},
	HR_ARCHIVES_EMPLOYEE_BUSINESS_LIST_GET_SUCCESS(state, { data, param: { table_type, page } }) {
		state.listInfo = {
			...state.listInfo,
			[table_type]: {
				...state.listInfo[table_type],
				total: data.totalCount,
				data: {
					...state.listInfo[table_type].data,
					[page]: data.list
				}
			}
		};
	},
	HR_ARCHIVES_EMPLOYEE_BUSINESS_LIST_RESET(state, { table_type }) {
		state.listInfo = {
			...initialState.listInfo,
			[table_type]: {
				...initPage,
				reset: true
			}
		};
	},
	HR_ARCHIVES_EMPLOYEE_BUSINESS_LIST_INIT(state, payload) {
		// state.listInfo = {
		// 	...initialState.listInfo
		// };
		state.listInfo = cloneDeep(initialState.listInfo);
	},
	HR_ARCHIVES_EMPLOYEE_BUSINESS_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	HR_ARCHIVES_EMPLOYEE_BUSINESS_TITLE_CHANGE(state, payload) {
		state.title[payload.type].title_show = payload.title_show;
		state.title[payload.type].title_hide = payload.title_hide;
	}
};

export const hrArchivesEmployeeBusiness = {
	state: { ...initialState },
	mutations,
};
