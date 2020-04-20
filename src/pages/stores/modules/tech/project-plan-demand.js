import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {}
};

const mutations = {
	TECH_PROJECT_PLAN_DEMAND_LIST_GET_SUCCESS(state, { data, param: { project_id, page } }) {
		state.listInfo = {
			...state.listInfo,
			[project_id]: {
				...state.listInfo[project_id],
				total: data.totalCount,
				data: {
					...state.listInfo[project_id].data,
					[page]: data.list
				}
			}
		};
	},
	_TECH_PROJECT_PLAN_DEMAND_TABS_GET_SUCCESS(state, { data = [] }) {
		const listInfo = {};
		data.forEach(item => {
			listInfo[item.project_id] = {
				...initPage
			};
		});
		state.listInfo = listInfo;
	},
	TECH_PROJECT_PLAN_DEMAND_LIST_RESET(state, { project_id }) {
		Object.keys(state.listInfo).forEach(key => {
			state.listInfo[key] = {
				...initialState.listInfo,
				[project_id]: {
					...initPage,
					reset: true
				}
			};
		});
	},
	TECH_PROJECT_PLAN_DEMAND_LIST_INIT(state, payload) {
		Object.keys(state.listInfo).forEach(key => {
			state.listInfo[key] = { ...initPage };
		});
	},
	TECH_PROJECT_PLAN_DEMAND_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
};

export const techProjectPlanDemand = {
	state: { ...initialState },
	mutations,
};
