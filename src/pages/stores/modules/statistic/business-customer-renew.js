import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
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
	STATISTIC_BUSINESS_CUSTOMER_RENEW_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
		state.listInfo = {
			...state.listInfo,
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
	STATISTIC_BUSINESS_CUSTOMER_RENEW_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			[type]: {
				...initPage,
				reset: true
			}
		};
	},
	STATISTIC_BUSINESS_CUSTOMER_RENEW_LIST_INIT(state, payload) {
		if (payload && payload.type) {
			state.listInfo = {
				...state.listInfo,
				[payload.type]: {
					...initPage,
				}
			};
		} else {
			state.listInfo = {
				...initialState.listInfo,
			};
		}
	},
	STATISTIC_BUSINESS_CUSTOMER_RENEW_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
};

export const statisticBusinessCustomerRenew = {
	state: { ...initialState },
	mutations,
};
