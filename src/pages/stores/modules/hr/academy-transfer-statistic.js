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
	HR_ACADEMY_TRANSFER_STATISTIC_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
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
	HR_ACADEMY_TRANSFER_STATISTIC_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			[type]: {
				...initPage,
				reset: true
			}
		};
	},
	HR_ACADEMY_TRANSFER_STATISTIC_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	HR_ACADEMY_TRANSFER_STATISTIC_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	HR_ACADEMY_TRANSFER_STATISTIC_SET_TYPE(state, payload) {
		state.type = payload;
	},
	// 讲师数据
	HR_ACADEMY_TRANSFER_STATISTIC_TEACHER_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
		state.teachList = {
			...state.teachList,
			total: data.totalCount,
			data: {
				...state.teachList.data,
				[page]: data.list
			}
		};
	},
	HR_ACADEMY_TRANSFER_STATISTIC_TEACHER_LIST_INIT(state, payload) {
		state.teachList = {
			...initialState.teachList
		};
	},
	HR_ACADEMY_TRANSFER_STATISTIC_TEACHER_LIST_RESET(state, payload) {
		state.teachList = {
			...initialState.teachList,
			reset: true
		};
	},
	// 需求统计
	HR_ACADEMY_TRANSFER_STATISTIC_DEMAND_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
		state.demandList = data;
		state.isFetched = true;
	}
};

export const hrAcademyTransferStatistic = {
	state: { ...initialState },
	mutations,
};
