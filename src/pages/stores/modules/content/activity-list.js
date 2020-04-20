import { initPage } from '@utils/utils';

// initPage = {
// 	total: 0,
// 	reset: false,
// 	data: {}
// };

const initialState = {
	listInfo: {
		'0': {
			...initPage,
		},
		'1': {
			...initPage
		},
		'2': {
			...initPage
		},
		'3': {
			...initPage
		},
		'4': {
			...initPage
		},
		'5': {
			...initPage
		},
	}
};

const mutations = {
	CONTENT_ACTIVITY_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
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
	CONTENT_ACTIVITY_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			[type]: {
				...initPage,
				reset: true
			}
		};
	},
	CONTENT_ACTIVITY_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	CONTENT_ACTIVITY_LIST_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	CONTENT_ACTIVITY_EDIT_ACTIVITY_POST_SUCCESS(state, payload) {

	}
};

export const contentActivityList = {
	state: { ...initialState },
	mutations,
};
