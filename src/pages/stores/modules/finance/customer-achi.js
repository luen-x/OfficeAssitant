import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
		count: [0, 0, 0],
		'1': {
			...initPage
		},
		'2': {
			...initPage
		},
		'3': {
			...initPage
		},
	}
};

const mutations = {
	FINANCE_CUSTOMER_ACHI_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
		state.listInfo = {
			...state.listInfo,
			count: [data.default_count, data.success_count, data.error_count],
			[type]: {
				...state.listInfo[type],
				total: data.totalCount,
				data: {
					...state.listInfo[type].data,
					[page]: data.list
				}
			}
		};
	},
	FINANCE_CUSTOMER_ACHI_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			[type]: {
				...initPage,
				reset: true
			}
		};
	},
	FINANCE_CUSTOMER_ACHI_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	FINANCE_CUSTOMER_ACHI_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
};

export const financeCustomerAchi = {
	state: { ...initialState },
	mutations,
};
