import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
		'0': {
			...initPage
		},
		'1': {
			...initPage
		},
		'2': {
			...initPage
		},
		'3': {
			...initPage
		}
	},
	count_open: 0
};

const mutations = {
	CONTENT_NOTICE_INFORM_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
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
	CONTENT_NOTICE_INFORM_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			[type]: {
				...initPage,
				reset: true
			}
		};
	},
	CONTENT_NOTICE_INFORM_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	CONTENT_NOTICE_INFORM_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	CONTENT_NOTICE_INFORM_COUNT_OPEN(state, { count_open }) {
		state.count_open = count_open;
	}
};

export const contentNoticeInform = {
	state: { ...initialState },
	mutations
};