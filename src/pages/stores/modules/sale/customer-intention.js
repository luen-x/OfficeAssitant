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
	SALE_CUSTOMER_INTENTION_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
		state.listInfo = {
			...state.listInfo,
			total: data.totalCount,
			data: {
				...state.listInfo.data,
				[page]: data.list
			}
		};
	},
	SALE_CUSTOMER_INTENTION_LIST_RESET(state) {
		state.listInfo = {
			...initialState.listInfo,
			reset: true
		};
	},
	SALE_CUSTOMER_INTENTION_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	SALE_CUSTOMER_INTENTION_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	SALE_CUSTOMER_INTENTION_TITLE_CHANGE(state, payload) {
		state.title[payload.type].title_show = payload.title_show;
		state.title[payload.type].title_hide = payload.title_hide;
	}

};

export const saleCustomerIntention = {
	state: { ...initialState },
	mutations,
};
