import { initPage } from '@utils/utils';
import { cloneDeep } from 'lodash';

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
	SALE_CUSTOMER_DEAL_ARRIVE_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
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
	SALE_CUSTOMER_DEAL_ARRIVE_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			[type]: {
				...initPage,
				reset: true
			}
		};
	},
	SALE_CUSTOMER_DEAL_ARRIVE_LIST_INIT(state, payload) {
		state.listInfo = cloneDeep(initialState.listInfo);
	},
	
	SALE_CUSTOMER_DEAL_ARRIVE_ROUTE_CHANGE(state, payload) {
		state.listInfo = cloneDeep(initialState.listInfo);
	},
};

export const saleCustomerDealArrive = {
	state: { ...initialState },
	mutations,
};
