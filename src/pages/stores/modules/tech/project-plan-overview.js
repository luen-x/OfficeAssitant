import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
		...initPage
	}
};

const mutations = {
	TECH_PROJECT_PLAN_OVERVIEW_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
		state.listInfo = {
			...state.listInfo,
			total: data.totalCount,
			data: {
				...state.listInfo.data,
				[page]: data.list
			}
		};
	},
	TECH_PROJECT_PLAN_OVERVIEW_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			reset: true
		};
	},
	TECH_PROJECT_PLAN_OVERVIEW_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	TECH_PROJECT_PLAN_OVERVIEW_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
};

export const techProjectPlanOverview = {
	state: { ...initialState },
	mutations,
};
