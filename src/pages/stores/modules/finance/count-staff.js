import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
		...initPage
	}
};

const mutations = {
	FINANCE_COUNT_STAFF_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
		state.listInfo = {
			...state.listInfo,
			total: data.totalCount,
			data: {
				...state.listInfo.data,
				[page]: data.list
			}
		};
	},
	FINANCE_COUNT_STAFF_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			reset: true
		};
	},
	FINANCE_COUNT_STAFF_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	FINANCE_COUNT_STAFF_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
};

export const financeCountStaff = {
	state: { ...initialState },
	mutations,
};
