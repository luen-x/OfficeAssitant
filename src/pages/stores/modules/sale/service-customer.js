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
		count: [0, 0, 0, 0],
		applyNum: '',
		fixPosition: false
	},
};

const mutations = {
	SALE_SERVICE_CUSTOMER_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
		state.listInfo = {
			...state.listInfo,
			[type]: {
				...state.listInfo[type],
				total: data.totalCount,
				data: {
					...state.listInfo[type].data,
					[page]: data.list
				}
			},
			count: data.count,
			applyNum: data.apply_num
		};
	},
	SALE_SERVICE_CUSTOMER_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			[type]: {
				...initPage,
				reset: true
			}
		};
	},
	SALE_SERVICE_CUSTOMER_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	SALE_SERVICE_CUSTOMER_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	}
};

export const saleServiceCustomer = {
	state: { ...initialState },
	mutations,
};
