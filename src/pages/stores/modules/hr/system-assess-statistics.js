import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
		'1': {
			...initPage
		},
		'2': {
			...initPage
		},
	}
};

const mutations = {
	HR_SYSTEM_ASSESS_STATISTICS_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
		state.listInfo = {
			...state.listInfo,
			'2': {
				...state.listInfo['2'],
				total: data.totalCount,
				data: {
					...state.listInfo['2'].data,
					[page]: data.list
				}
			}
		};
	},
	HR_SYSTEM_ASSESS_STATISTICS_MAIN_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
		state.listInfo = {
			...state.listInfo,
			'1': {
				...state.listInfo['1'],
				total: data.totalCount,
				data: {
					...state.listInfo['1'].data,
					[page]: data
				}
			}
		};
	},
	HR_SYSTEM_ASSESS_STATISTICS_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			[type]: {
				...initPage,
				reset: true
			}
		};
	},
	HR_SYSTEM_ASSESS_STATISTICS_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	HR_SYSTEM_ASSESS_STATISTICS_DEL_POST(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	HR_SYSTEM_ASSESS_STATISTICS_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
};

export const hrSystemAssessStatistics = {
	state: { ...initialState },
	mutations,
};
