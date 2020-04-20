import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
		...initPage,
		course_info: {
			lecture: []
		}
	}
};

const mutations = {
	ACADEMY_TRAIN_PLAN_DETAIL_PARTICIPATE_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
		state.listInfo = {
			...state.listInfo,
			total: data.totalCount,
			data: {
				...state.listInfo.data,
				[page]: data.list
			},
			course_info: data.course_info
		};
	},
	ACADEMY_TRAIN_PLAN_DETAIL_PARTICIPATE_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			reset: true
		};
	},
	ACADEMY_TRAIN_PLAN_DETAIL_PARTICIPATE_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	ACADEMY_TRAIN_PLAN_DETAIL_PARTICIPATE_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
};

export const academyTrainPlanDetailParticipate = {
	state: { ...initialState },
	mutations,
};
