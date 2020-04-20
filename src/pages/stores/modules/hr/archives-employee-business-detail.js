import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
		...initPage
	},
	title: {
		title_show: [],
		title_hide: []
	}
};

const mutations = {
	HR_ARCHIVES_EMPLOYEE_BUSINESS_DETAIL_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
		state.listInfo = {
			...state.listInfo,
			total: data.totalCount,
			data: {
				...state.listInfo.data,
				[page]: data.list
			}
		};
	},
	HR_ARCHIVES_EMPLOYEE_BUSINESS_DETAIL_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			reset: true
		};
	},
	HR_ARCHIVES_EMPLOYEE_BUSINESS_DETAIL_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	HR_ARCHIVES_EMPLOYEE_BUSINESS_DETAIL_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	HR_ARCHIVES_EMPLOYEE_DETAIL_TITLE_CHANGE(state, payload) {
		state.title.title_show = payload.title_show;
		state.title.title_hide = payload.title_hide;
	}
};

export const hrArchivesEmployeeBusinessDetail = {
	state: { ...initialState },
	mutations,
};
