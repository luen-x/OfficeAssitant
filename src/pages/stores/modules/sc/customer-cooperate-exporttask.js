import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
		...initPage
	}
};

const mutations = {
	SC_CUSTOMER_COOPERATE_EXPORTTASK_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
		state.listInfo = {
			...state.listInfo,
			total: data.totalCount,
			data: {
				...state.listInfo.data,
				[page]: data.list
			}
		};
	},
	SC_CUSTOMER_COOPERATE_EXPORTTASK_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			reset: true
		};
	},
	SC_CUSTOMER_COOPERATE_EXPORTTASK_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	SC_CUSTOMER_COOPERATE_EXPORTTASK_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
};

export const scCustomerCooperateExporttask = {
	state: { ...initialState },
	mutations,
};
