import { initPage } from "@utils/utils";

const initialState = {
	listInfo: {
		"1": {
			...initPage
		},
		"2": {
			...initPage
		},
		"3": {
			...initPage
		},
		"4": {
			...initPage
		}
	},
	balance: []
};

const mutations = {
	SALE_CUSTOMER_DEAL_DEAL_DETAIL_LIST1_GET_SUCCESS(
		state,
		{
			data,
			param: { type, page }
		}
	) {
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
	SALE_CUSTOMER_DEAL_DEAL_DETAIL_LIST1_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			[type]: {
				...initPage,
				reset: true
			}
		};
	},
	SALE_CUSTOMER_DEAL_DEAL_DETAIL_LIST1_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	SALE_CUSTOMER_DEAL_DEAL_DETAIL_ROUTE1_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	SALE_CUSTOMER_DEAL_DEAL_DETAIL_LIST2_GET_SUCCESS(
		state,
		{
			data,
			param: { type, page }
		}
	) {
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
	SALE_CUSTOMER_DEAL_DEAL_DETAIL_LIST2_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			[type]: {
				...initPage,
				reset: true
			}
		};
	},
	SALE_CUSTOMER_DEAL_DEAL_DETAIL_LIST2_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	SALE_CUSTOMER_DEAL_DEAL_DETAIL_ROUTE2_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	SALE_CUSTOMER_DEAL_DEAL_DETAIL_LIST3_GET_SUCCESS(
		state,
		{
			data,
			param: { type, page }
		}
	) {
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
	SALE_CUSTOMER_DEAL_DEAL_DETAIL_LIST3_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			[type]: {
				...initPage,
				reset: true
			}
		};
	},
	SALE_CUSTOMER_DEAL_DEAL_DETAIL_LIST3_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	SALE_CUSTOMER_DEAL_DEAL_DETAIL3_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	SALE_CUSTOMER_DEAL_DEAL_DETAIL_LIST4_GET_SUCCESS(
		state,
		{
			data,
			param: { type, page }
		}
	) {
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
	SALE_CUSTOMER_DEAL_DEAL_DETAIL_LIST4_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			[type]: {
				...initPage,
				reset: true
			}
		};
	},
	SALE_CUSTOMER_DEAL_DEAL_DETAIL_LIST4_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	SALE_CUSTOMER_DEAL_DEAL_DETAIL4_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	SALE_CUSTOMER_DEAL_DEAL_DETAIL_BALANCE_UPDATE(state, balance) {
		state.balance = balance;
	},
	SALE_CUSTOMER_DEAL_DEAL_DETAIL_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
};

export const saleCustomerDealDealDetail = {
	state: { ...initialState },
	mutations
};
