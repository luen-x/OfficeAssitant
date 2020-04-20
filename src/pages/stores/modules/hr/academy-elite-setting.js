import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
	}
};

const mutations = {
	HR_ACADEMY_ELITE_SETTING_TABS_GET(state, tabs) {
		const listInfo = tabs.reduce((init, cur, index) => {
			init[index + ''] = {
				...initPage
			};
			return init;
		}, {});
		state.listInfo = {
			...listInfo
		};
	},
	HR_ACADEMY_ELITE_SETTING_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
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
	HR_ACADEMY_ELITE_SETTING_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			[type]: {
				...initPage,
				reset: true
			}
		};
	},
	HR_ACADEMY_ELITE_SETTING_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	HR_ACADEMY_ELITE_SETTING_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
};

export const hrAcademyEliteSetting = {
	state: { ...initialState },
	mutations,
};
