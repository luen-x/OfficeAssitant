import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
		...initPage
	}
};

const mutations = {
	STATISTIC_BUSINESS_CUSTOMER_REPRODUCT_ZONE_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
		state.listInfo = {
			...state.listInfo,
			total: data.totalCount,
			data: {
				...state.listInfo.data,
				[page]: data.list
			}
		};
	},
	STATISTIC_BUSINESS_CUSTOMER_REPRODUCT_ZONE_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			reset: true
		};
	},
	STATISTIC_BUSINESS_CUSTOMER_REPRODUCT_ZONE_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	STATISTIC_BUSINESS_CUSTOMER_REPRODUCT_ZONE_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
};

export const statisticBusinessCustomerReproductZone = {
	state: { ...initialState },
	mutations,
};
