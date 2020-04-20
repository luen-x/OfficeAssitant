import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
		...initPage
	},
	title: {
		'1': {
			title_show: [],
			title_hide: []
		}
	},
	industryList: []
};

const mutations = {
	SALE_SEA_ARCHIVE_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
		state.listInfo = {
			...state.listInfo,
			total: data.totalCount,
			data: {
				...state.listInfo.data,
				[page]: data.list
			}
		};
	},
	SALE_SEA_ARCHIVE_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			reset: true
		};
	},
	SALE_SEA_ARCHIVE_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	SALE_SEA_ARCHIVE_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	SALE_SEA_ARCHIVE_TITLE_CHANGE(state, payload) {
		state.title[payload.type].title_show = payload.title_show;
		state.title[payload.type].title_hide = payload.title_hide;
	},
	SALE_SEA_ARCHIVE_INDUSTRY_LIST_UPDATE(state, payload) {
		state.industryList = payload;
	},
	_SALE_SEA_ARCHIVE_LIST_RESET_SILENCE(state, { page, data }) {
		state.listInfo = {
			...initialState.listInfo,
			total: data.totalCount,
			data: {
				[page]: data.list
			}
		};
	}
};

export const saleSeaArchive = {
	state: { ...initialState },
	mutations,
};
