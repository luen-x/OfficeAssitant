import { initPage } from '@utils/utils';

let initialListInfo = {};
const initialState = {
	listInfo: {},
	tabs: [],
	hasSetting: false,
	isFetched: false
};

const mutations = {
	HR_STAIR_DEPART_GET_SUCCESS(state, res, param) {
		state.isFetched = true;

		if (res.data.length) {
			state.hasSetting = true;
		}
		state.tabs = [
			...res.data
		];

		for (let i = 0; i < state.tabs.length; i++) {
			initialListInfo = {
				...initialListInfo,
				[state.tabs[i].depart_id]: {
					...initPage
				}
			};
		}
		state.listInfo = {
			...initialListInfo
		};
	},
	HR_SALARY_TEAM_LIST_GET_SUCCESS(state, { data, param: { depart_id: type, page } }) {
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
	HR_SALARY_TEAM_LIST_RESET(state, { depart_id: type }) {
		state.listInfo = {
			...initialState.listInfo,
			[type]: {
				...initPage,
				reset: true
			}
		};
	},
	HR_SALARY_TEAM_LIST_INIT(state, payload) {
		state.listInfo = {
			...state.listInfo,
			[payload]: {
				...initPage
			}
		};
	},
	HR_SALARY_TEAM_ROUTE_CHANGE(state, payload) {
		state.listInfo = {};
		state.tabs = [];
	},
};

export const hrSalaryTeam = {
	state: { ...initialState },
	mutations,
};
