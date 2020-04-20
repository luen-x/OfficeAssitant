import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
		...initPage
	},
	recycle_num: null
};

const mutations = {
	CONTENT_PRODUCT_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
		state.listInfo = {
			...state.listInfo,
			total: data.totalCount,
			data: {
				...state.listInfo.data,
				[page]: data.list
			}
		};
		state.recycle_num = data.recycle_num;
	},
	CONTENT_PRODUCT_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			reset: true
		};
	},
	CONTENT_PRODUCT_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	CONTENT_PRODUCT_LIST_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
};

export const contentProductList = {
	state: { ...initialState },
	mutations,
};
