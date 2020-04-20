import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
		...initPage
	},
	title: {
		'1': {
			title_show: [],
			title_hide: []
		}
	}
};

const mutations = {
	SALE_CUSTOMER_BUSINESS_CHECK_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
		state.listInfo = {
			...state.listInfo,
			total: data.totalCount,
			data: {
				...state.listInfo.data,
				[page]: data.list
			}
		};
	},
	SALE_CUSTOMER_BUSINESS_CHECK_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			reset: true
		};
	},
	SALE_CUSTOMER_BUSINESS_CHECK_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	SALE_CUSTOMER_BUSINESS_CHECK_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	SALE_CUSTOMER_BUSINESS_CHECK_TITLE_CHANGE(state, payload) {
		state.title[1].title_show = payload.title_show;
		state.title[1].title_hide = payload.title_hide;
	}
};

export const saleCustomerBusinessCheck = {
	state: { ...initialState },
	mutations,
};
