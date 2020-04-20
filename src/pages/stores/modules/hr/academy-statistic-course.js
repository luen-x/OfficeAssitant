import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
		count: [0, 0],
		'1': {
			...initPage
		},
		'2': {
			...initPage
		},
		type: ''
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
	HR_ACADEMY_STATISTIC_COURSE_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
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
			count: [data.default_count, data.delete_count, data.await_join_count]
		};
	},
	HR_ACADEMY_STATISTIC_COURSE_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			[type]: {
				...initPage,
				reset: true
			}
		};
	},
	HR_ACADEMY_STATISTIC_COURSE_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	HR_ACADEMY_STATISTIC_COURSE_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	HR_ACADEMY_STATISTIC_COURSE_TITLE_CHANGE(state, payload) {
		state.title[payload.type].title_show = payload.title_show;
		state.title[payload.type].title_hide = payload.title_hide;
	},
	HR_ACADEMY_STATISTIC_COURSE_SELECTED_TAB(state, payload) {
		state.type = payload;
	},
};

export const hrAcademyStatisticCourse = {
	state: { ...initialState },
	mutations,
};
