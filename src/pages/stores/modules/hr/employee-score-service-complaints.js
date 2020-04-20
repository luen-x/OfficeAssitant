import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
		count: [0, 0, 0],
		'1': {
			...initPage
		},
		'2': {
			...initPage
		},
		'3': {
			...initPage
		},
	}
};

const mutations = {
	HR_EMPLOYEE_SCORE_SERVICE_COMPLAINTS_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
		state.listInfo = {
			...state.listInfo,
			[type]: {
				...state.listInfo[type],
				total: data.totalCount,
				data: {
					...state.listInfo[type].data,
					[page]: data.list
				}
			},
			count: [data.count[0], data.count[1], data.count[2]]
		};
	},
	HR_EMPLOYEE_SCORE_SERVICE_COMPLAINTS_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			[type]: {
				...initPage,
				reset: true
			}
		};
	},
	HR_EMPLOYEE_SCORE_SERVICE_COMPLAINTS_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	HR_EMPLOYEE_SCORE_SERVICE_COMPLAINTS_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
};

export const hrEmployeeScoreServiceComplaints = {
	state: { ...initialState },
	mutations,
};
