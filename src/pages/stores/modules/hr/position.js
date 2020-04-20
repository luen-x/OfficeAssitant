import { initPage } from '@utils/utils';

let initialListInfo = {};
const initialState = {
	listInfo: {
	},
	tabs: []
};

const mutations = {
	// HR_STAIR_DEPART_GET_SUCCESS(state, res, param) {
	// 	state.tabs = [
	// 		...res.data
	// 	];
	// 	for (let i = 0; i < state.tabs.length; i++) {
	// 		initialListInfo = {
	// 			...initialListInfo,
	// 			[state.tabs[i].depart_id]: {
	// 				...initPage
	// 			}
	// 		};
	// 	}
	// 	state.listInfo = {
	// 		...initialListInfo
	// 	};
	// },
	HR_POSITION_LIST_TABLE_GET_SUCCESS(state, res, param) {
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
	HR_POSITION_LIST_GET_SUCCESS(state, { data, param: { depart_id: type, page } }) {
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
	HR_POSITION_LIST_RESET(state, { depart_id: type }) {
		state.listInfo = {
			...initialListInfo,
			[type]: {
				...initPage,
				reset: true
			}
		};
	},
	HR_POSITION_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialListInfo
		};
	},
	HR_POSITION_ROUTE_CHANGE(state, payload) {
		state.listInfo = {};
		state.tabs = [];
	},
	HR_POSITION_ADD_POST_SUCCESS(state, { data, param: { depart_id: type, page } }) {
		if (type) {
			state.listInfo = {
				...initialListInfo,
				[type]: {
					...initPage,
					reset: true
				}
			};
		} else {
			state.listInfo = {};
			state.tabs = [];
		}
		
	},
	HR_POSITION_DEL_POST_SUCCESS(state, payload) {
		state.listInfo = {};
		state.tabs = [];
	}
};

export const hrPosition = {
	state: { ...initialState },
	mutations,
};
