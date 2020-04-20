import { initPage } from '@utils/utils';

const initialState = {
	type: '',
	isFetched: false,
	demandList: [],
	teachList: {
		...initPage
	}
};

const mutations = {
	ACADEMY_TRANSFER_STATISTICS_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
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
	ACADEMY_TRANSFER_STATISTICS_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			[type]: {
				...initPage,
				reset: true
			}
		};
	},
	ACADEMY_TRANSFER_STATISTICS_LIST_INIT(state, payload) {
		state.teachList = {
			...initialState.teachList
		};
	},
	ACADEMY_TRANSFER_STATISTICS_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	ACADEMY_TRANSFER_STATISTICS_SET_TYPE(state, payload) {
		state.type = payload;
	},
	// 讲师数据
	ACADEMY_TRANSFER_STATISTICS_TEACHERS_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
		state.teachList = {
			...state.teachList,
			total: data.totalCount,
			data: {
				...state.teachList.data,
				[page]: data.list
			}
		};
	},
	// 需求统计
	ACADEMY_TRANSFER_STATISTICS_DEMAND_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
		state.demandList = data;
		state.isFetched = true;
	}
};

export const academyTransferStatistics = {
	state: { ...initialState },
	mutations,
};
