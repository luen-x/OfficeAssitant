import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
		count: [0, 0, 0],
		'1': {
			...initPage
		},
		'2': {
			...initPage
		},
		'3': {
			...initPage
		},
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
		},
		'3': {
			title_show: [],
			title_hide: []
		}
	},
	sortData: [],
	searchData: {
		title_show: [],
		title_hide: []
	}
};

const mutations = {
	SC_PRODUCT_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
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
			count: [data.wait_count, data.complete_count, data.expire_count]
		};
	},
	SC_PRODUCT_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			[type]: {
				...initPage,
				reset: true
			}
		};
	},
	SC_PRODUCT_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	SC_PRODUCT_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	SC_PRODUCT_TITLE_CHANGE(state, payload) { 
		state.title[payload.type].title_show = payload.title_show;
		state.title[payload.type].title_hide = payload.title_hide;
	},
	SC_PRODUCT_SELECTED_TAB(state, payload) {
		state.type = payload;
	},
	SC_PRODUCT_LIST_SORT(state, payload) {
		state.sortData = payload;
	},
	SC_PRODUCT_LIST_SEARCH(state, payload) {
		state.searchData.title_show = payload.title_show;
		state.searchData.title_hide = payload.title_hide;
	}
};

export const scProduct = {
	state: { ...initialState },
	mutations,
};
