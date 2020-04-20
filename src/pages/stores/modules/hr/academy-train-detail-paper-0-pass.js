import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
		...initPage
	}
};

const mutations = {
	HR_ACADEMY_TRAIN_DETAIL_PAPER_0_PASS_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
		state.listInfo = {
			...state.listInfo,
			total: data.totalCount,
			data: {
				...state.listInfo.data,
				[page]: data.list
			}
		};
	},
	HR_ACADEMY_TRAIN_DETAIL_PAPER_0_PASS_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			reset: true
		};
	},
	HR_ACADEMY_TRAIN_DETAIL_PAPER_0_PASS_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	HR_ACADEMY_TRAIN_DETAIL_PAPER_0_PASS_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
};

export const hrAcademyTrainDetailPaper0Pass = {
	state: { ...initialState },
	mutations,
};
