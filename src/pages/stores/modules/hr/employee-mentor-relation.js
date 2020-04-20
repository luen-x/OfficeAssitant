import { initPage } from '@utils/utils';

let initialListInfo = {};
const initialState = {
	listInfo: {
	},
	tabs: []
};

const mutations = {
	HR_MASTER_APPRENTICE_DEPART_LIST_GET_SUCCESS(state, res, param) {
		state.tabs = [
			...res.data
		];
		for (let i = 0; i < state.tabs.length; i++) {
			initialListInfo = {
				...initialListInfo,
				[state.tabs[i].first_depart_id]: {
					...initPage
				}
			};
		}
		state.listInfo = {
			...initialListInfo
		};
	},
	HR_EMPLOYEE_MENTOR_RELATION_LIST_GET_SUCCESS(state, { data, param: { first_depart_id: type, page } }) {

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
	HR_EMPLOYEE_MENTOR_RELATION_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			[type]: {
				...initPage,
				reset: true
			}
		};
	},
	HR_EMPLOYEE_MENTOR_RELATION_LIST_INIT(state, payload) {
		for (let i = 0; i < state.tabs.length; i++) {
			initialListInfo = {
				...initialListInfo,
				[state.tabs[i].first_depart_id]: {
					...initPage
				}
			};
		}
		state.listInfo = {
			...initialListInfo
		};
	},
	HR_EMPLOYEE_MENTOR_RELATION_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
};

export const hrEmployeeMentorRelation = {
	state: { ...initialState },
	mutations,
};
