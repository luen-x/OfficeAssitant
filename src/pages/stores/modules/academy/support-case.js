import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
		'0': {
			...initPage
		},
		// '1': {
		// 	...initPage
		// },
		// '2': {
		// 	...initPage
		// },
		// '3': {
		// 	...initPage
		// },
	}
};

const mutations = {
	ACADEMY_SUPPORT_CASE_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
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
	ACADEMY_SUPPORT_CASE_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			[type]: {
				...initPage,
				reset: true
			}
		};
	},
	ACADEMY_SUPPORT_CASE_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	ACADEMY_SUPPORT_CASE_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	ACADEMY_SUPPORT_CASE_TAB_INIT(state, tabs) {
		state.listInfo = tabs.map(t => ({ [t.value]: { ...initPage } }));
		initialState.listInfo = state.listInfo;
		

	}
};

export const academySupportCase = {
	state: { ...initialState },
	mutations,
};
