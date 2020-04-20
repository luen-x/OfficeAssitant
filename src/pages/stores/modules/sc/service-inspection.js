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
	type: '',
	title: {
		'1': {
			title_show: [],
			title_hide: []
		},
		'2': {
			title_show: [],
			title_hide: []
		}
	}
};

const mutations = {
	SC_SERVICE_INSPECTION_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
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
			count: [data.tab_data.wait_quality_count, data.tab_data.has_quality_count]
		};
	},
	SC_SERVICE_INSPECTION_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			[type]: {
				...initPage,
				reset: true
			}
		};
	},
	SC_SERVICE_INSPECTION_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	SC_SERVICE_INSPECTION_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	SC_SERVICE_INSPECTION_TITLE_CHANGE(state, payload) {
		state.title[payload.type].title_show = payload.title_show;
		state.title[payload.type].title_hide = payload.title_hide;
	},
	SC_SERVICE_INSPECTION_SELECTED_TAB(state, payload) {
		state.type = payload;
	}
};

export const scServiceInspection = {
	state: { ...initialState },
	mutations,
};
