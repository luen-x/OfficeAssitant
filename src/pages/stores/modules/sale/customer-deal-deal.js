import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
		...initPage
	}
};
const mutations = {
	SALE_CUSTOMER_DEAL_DEAL_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
		state.listInfo = {
			...state.listInfo,
			total: data.totalCount,
			data: {
				...state.listInfo.data,
				[page]: data.list
			}
		};
	},
	SALE_CUSTOMER_DEAL_DEAL_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			reset: true
		};
	},
	SALE_CUSTOMER_DEAL_DEAL_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	SALE_CUSTOMER_DEAL_DEAL_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
};

export const saleCustomerDealDeal = {
	state: { ...initialState },
	mutations,
};
