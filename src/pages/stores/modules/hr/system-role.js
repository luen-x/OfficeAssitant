import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {},
	tabs: []
};

const mutations = {
	HR_ROLE_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
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
	HR_ROLE_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			[type]: {
				...initPage,
				reset: true
			}
		};
	},
	HR_ROLE_LIST_INIT(state, payload) {
		// state.listInfo = {
		// 	...initialState.listInfo
		// };
		const listInfo = {};
		for (let i = 0; i < state.tabs.length; i++) {
			listInfo[i] = {
				...initPage
			};
		}
		state.listInfo = listInfo;
	},
	HR_ROLE_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	HR_ROLE_LIST_TABS_INIT(state, tabs) {
		const listInfo = {};
		for (let i = 0; i < tabs.length; i++) {
			listInfo[i] = {
				...initPage
			};
		}
		state.listInfo = listInfo;
		state.tabs = tabs;
	}
};

export const hrSystemRole = {
	state: { ...initialState },
	mutations,
};
