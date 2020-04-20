import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
		count: [0, 0, 0, 0, 0, 0],
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
		'6': {
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
		},
		'6': {
			title_show: [],
			title_hide: []
		}
	},
	time: ""
};

const mutations = {
	SC_MANAGE_INSPECTION_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
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
			count: [data.tab_data.wait_distribution_count, data.tab_data.wait_quality_count,
				data.tab_data.has_quality_count, data.tab_data.no_need_quality_count,
				data.tab_data.service_expire_count, data.tab_data.lose_efficacy_count]
		};
	},
	SC_MANAGE_INSPECTION_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			[type]: {
				...initPage,
				reset: true
			}
		};
	},
	SC_MANAGE_INSPECTION_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	SC_MANAGE_INSPECTION_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	SC_MANAGE_INSPECTION_TITLE_CHANGE(state, payload) {
		state.title[payload.type].title_show = payload.title_show;
		state.title[payload.type].title_hide = payload.title_hide;
	},
	SC_MANAGE_INSPECTION_SELECTED_TAB(state, payload) {
		state.type = payload;
	},
	SC_MANAGE_INSPECTION_PERIOD(state, payload) {
		state.time = payload;
	}
};

export const scManageInspection = {
	state: { ...initialState },
	mutations
};