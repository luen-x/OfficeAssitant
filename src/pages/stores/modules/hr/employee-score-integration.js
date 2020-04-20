import { initPage } from '@utils/utils';

const initialState = {
	tabs: [],
	ic_system_id: '',
	listInfo: {
	}
};
let tabObj = {};

const mutations = {
	HR_EMPLOYEE_INTEGRATION_SYSTEM_ID_SET(state, data) {
		state.ic_system_id = data;
	},
	HR_EMPLOYEE_INTEGRATION_TABS_GET_SUCCESS(state, { data, param }) {
		state.tabs = data;
		data.forEach(item => {
			state.listInfo = {
				...state.listInfo,
				[item.ic_system_id]: {
					...initPage
				}
			};
		});
		tabObj = state.listInfo;
		state.ic_system_id = data[0].ic_system_id + '';
	},
	HR_EMPLOYEE_SCORE_INTEGRATION_LIST_GET_SUCCESS(state, { data, param: { ic_system_id, page } }) {
		state.listInfo = {
			...state.listInfo,
			[ic_system_id]: {
				...state.listInfo[ic_system_id],
				total: data.totalCount,
				data: {
					...state.listInfo[ic_system_id].data,
					[page]: data.list
				}
			}
		};
	},
	HR_EMPLOYEE_SCORE_INTEGRATION_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			[type]: {
				...initPage,
				reset: true
			}
		};
	},
	HR_EMPLOYEE_SCORE_INTEGRATION_LIST_INIT(state, payload) {
		state.listInfo = {
			...tabObj
		};
	},
	HR_EMPLOYEE_SCORE_INTEGRATION_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
};

export const hrEmployeeScoreIntegration = {
	state: { ...initialState },
	mutations,
};
