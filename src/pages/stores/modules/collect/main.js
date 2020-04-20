import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
		...initPage
	}
};

const mutations = {
	COLLECT_MAIN_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
		state.listInfo = {
			...state.listInfo,
			total: data.totalCount,
			data: {
				...state.listInfo.data,
				[page]: data.list
			}
		};
	},
	COLLECT_MAIN_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			reset: true
		};
	},
	COLLECT_MAIN_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	COLLECT_MAIN_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
};

export const collectMain = {
	state: { ...initialState },
	mutations,
};
