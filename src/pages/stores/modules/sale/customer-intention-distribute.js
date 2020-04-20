import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
		'0': {
			...initPage
		},
		'1': {
			...initPage
		},
		'2': {
			...initPage
		},
	}
};

const mutations = {
	SALE_CUSTOMER_INTENTION_DISTRIBUTE_LIST_GET_SUCCESS(state, { data, param: { tab: type, page } }) {
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
	SALE_CUSTOMER_INTENTION_DISTRIBUTE_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			[type]: {
				...initPage,
				reset: true
			}
		};
	},
	SALE_CUSTOMER_INTENTION_DISTRIBUTE_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	SALE_CUSTOMER_INTENTION_DISTRIBUTE_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
};

export const saleCustomerIntentionDistribute = {
	state: { ...initialState },
	mutations,
};
