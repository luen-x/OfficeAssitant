import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
		count: [0, 0],
		'1': {
			...initPage
		},
		'2': {
			...initPage
		}
	},
	title: {
		'1': {
			title_show: [],
			title_hide: []
		},
		'2': {
			title_show: [],
			title_hide: []
		},
	}
};

const mutations = {
	HR_EMPLOYEE_SUMMARY_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
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
			count: [data.entring_num, data.entry_num]
		};
	},
	HR_SUMMARY_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			[type]: {
				...initPage,
				reset: true
			}
		};
	},
	HR_SUMMARY_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo,
		};
		
	},
	HR_SUMMARY_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	HR_SUMMARY_TAB(state, payload) {
		state.type = payload;
	},
	HR_SUMMARY_TITLE_CHANGE(state, payload) {
		state.title[payload.type].title_show = payload.title_show;
		state.title[payload.type].title_hide = payload.title_hide;
	}
};


export const hrSummary = {
	state: { ...initialState },
	mutations,
};
