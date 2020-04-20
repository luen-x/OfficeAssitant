import { initPage } from '@utils/utils';

const initialState = {
	data: {},
	listInfo: {
		...initPage
	}
};

const mutations = {
	SC_MAIN_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	},
	SC_MAIN_SUPPLIST_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
		state.listInfo = {
			...state.listInfo,
			total: data.totalCount,
			data: {
				...state.listInfo.data,
				[page]: data.list
			}
		};
	},
	SC_MAIN_SUPPLIST_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			reset: true
		};
	},
	SC_MAIN_SUPPLIST_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
};

export const scMain = {
	state: { ...initialState },
	mutations,
};

