import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
		...initPage
	},
	month: ''
};

const mutations = {
	HR_SALARY_SUBSIDY_TRAFFIC_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
		state.listInfo = {
			...state.listInfo,
			total: data.totalCount,
			data: {
				...state.listInfo.data,
				[page]: data.list
			}
		};
	},
	HR_SALARY_SUBSIDY_TRAFFIC_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			reset: true
		};
	},
	HR_SALARY_SUBSIDY_TRAFFIC_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	HR_SALARY_SUBSIDY_TRAFFIC_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	HR_SALARY_SUBSIDY_TRAFFIC_SET_MONTH(state, payload) {
		state.month = payload;
	}
};

export const hrSalarySubsidyTraffic = {
	state: { ...initialState },
	mutations,
};
