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
		'4': {
			...initPage
		},
	}
};

const mutations = {
	FINANCE_CUSTOMER_NEGO_DETAIL_ACHI_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
		state.listInfo = {
			...state.listInfo,
			'1': {
				...state.listInfo['1'],
				total: data.totalCount,
				data: {
					...state.listInfo['1'].data,
					[page]: data.list
				}
			}
		};
	},
	FINANCE_CUSTOMER_NEGO_DETAIL_CUSTOMER_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
		state.listInfo = {
			...state.listInfo,
			'2': {
				...state.listInfo['2'],
				total: data.totalCount,
				data: {
					...state.listInfo['2'].data,
					[page]: data.list
				}
			}
		};
	},
	FINANCE_CUSTOMER_NEGO_DETAIL_REFUND_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
		state.listInfo = {
			...state.listInfo,
			'3': {
				...state.listInfo['3'],
				total: data.totalCount,
				data: {
					...state.listInfo['3'].data,
					[page]: data.list
				}
			}
		};
	},
	FINANCE_CUSTOMER_NEGO_DETAIL_TICKET_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
		state.listInfo = {
			...state.listInfo,
			'4': {
				...state.listInfo['4'],
				total: data.totalCount,
				data: {
					...state.listInfo['4'].data,
					[page]: data.list
				}
			}
		};
	},
	FINANCE_CUSTOMER_NEGO_DETAIL_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			[type]: {
				...initPage,
				reset: true
			}
		};
	},
	FINANCE_CUSTOMER_NEGO_DETAIL_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	FINANCE_CUSTOMER_NEGO_DETAIL_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
};

export const financeCustomerNegoDetail = {
	state: { ...initialState },
	mutations,
};
