import { initPage } from '@utils/utils';

const initialState = {
	listInfo: [...new Array(6).keys()].reduce(
		(init, cur) => ({ ...init, [cur + 1 + '']: { ...initPage } }),
		{}
	),
	type: '',
	title: {
		'1': {
			title_show: [],
			title_hide: []
		},
		'2': {
			title_show: [],
			title_hide: []
		},
		'3': {
			title_show: [],
			title_hide: []
		},
		'4': {
			title_show: [],
			title_hide: []
		},
		'5': {
			title_show: [],
			title_hide: []
		}
	}
};

const mutations = {
	COLLAGE_RECORD_OUTLINE_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
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
	COLLAGE_RECORD_OUTLINE_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			[type]: {
				...initPage,
				reset: true
			}
		};
	},
	COLLAGE_RECORD_OUTLINE_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	COLLAGE_RECORD_OUTLINE_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	COLLAGE_RECORD_OUTLINE_TITLE_CHANGE(state, payload) { 
		state.title[payload.type].title_show = payload.title_show;
		state.title[payload.type].title_hide = payload.title_hide;
	},
	COLLAGE_RECORD_OUTLINE_SELECTED_TAB(state, payload) {
		state.type = payload;
	}
};

export const collageRecordOutline = {
	state: { ...initialState },
	mutations,
};
