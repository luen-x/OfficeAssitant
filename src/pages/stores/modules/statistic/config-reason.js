import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
		...initPage
	},
	deleteNum: null
};

const mutations = {
	STATISTIC_CONFIG_REASON_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
		state.listInfo = {
			...state.listInfo,
			total: data.totalCount,
			data: {
				...state.listInfo.data,
				[page]: data.list
			}
		};
		state.deleteNum = data.delete_num;
	},
	STATISTIC_CONFIG_REASON_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			reset: true
		};
	},
	STATISTIC_CONFIG_REASON_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	STATISTIC_CONFIG_REASON_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	}
};

export const statisticConfigReason = {
	state: { ...initialState },
	mutations
};