import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
		// '1': {
		// 	...initPage
		// },
		// '2': {
		// 	...initPage
		// },
		// '3': {
		// 	...initPage
		// },
	},
	tabs: [],
	importStatus: { // 导入状态
		status: 0, // 0 未上传，1 上传中， 2 上传成功， 3 上传失败 
		percent: 0,
		msg: '',
	}
};

const mutations = {
	HR_ACADEMY_ELITE_TALENT_TABS_GET(state, tabs) {
		const listInfo = tabs.reduce((init, cur, index) => {
			init[index] = {
				...initPage
			};
			return init;
		}, {});
		state.listInfo = {
			...listInfo
		};
		state.tabs = [
			...tabs
		];
	},
	HR_ACADEMY_ELITE_TALENT_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
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
	HR_ACADEMY_ELITE_TALENT_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			[type]: {
				...initPage,
				reset: true
			}
		};
	},
	HR_ACADEMY_ELITE_TALENT_LIST_INIT(state, tabs) {
		// state.listInfo = {
		// 	...initialState.listInfo
		// };
		const listInfo = state.tabs.reduce((init, cur, index) => {
			init[index] = {
				...initPage
			};
			return init;
		}, {});
		state.listInfo = {
			...listInfo
		};

	},
	HR_ACADEMY_ELITE_TALENT_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	HR_ACADEMY_ELITE_TALENT_PERCENT_UPDATE(state, payload) {
		state.importStatus = { ...state.importStatus, ...payload };
	}
};

export const hrAcademyEliteTalent = {
	state: { ...initialState },
	mutations,
};
