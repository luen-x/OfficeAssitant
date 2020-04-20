import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
		count: [0, 0, 0, 0, 0],
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
		},
		'4': {
			...initPage
		},
	},
	type: '',
	title: {
		'0': {
			title_show: [],
			title_hide: []
		},
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
	}
};

const mutations = {
	HR_RECRUIT_SCHOOL_JOBFAIR_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
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
			count: [data.all_count, data.await_audit_count, data.await_join_count, data.joined_count, data.un_join_count]
		};
	},
	HR_RECRUIT_SCHOOL_JOBFAIR_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			[type]: {
				...initPage,
				reset: true
			}
		};
	},
	HR_RECRUIT_SCHOOL_JOBFAIR_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	HR_RECRUIT_SCHOOL_JOBFAIR_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	HR_RECRUIT_SCHOOL_JOBFAIR_TITLE_CHANGE(state, payload) {
		state.title[payload.type].title_show = payload.title_show;
		state.title[payload.type].title_hide = payload.title_hide;
	},
	HR_RECRUIT_SOCIAL_JOBFAIR_SELECTED_TAB(state, payload) {
		state.type = payload;
	},
};

export const hrRecruitSchoolJobfair = {
	state: { ...initialState },
	mutations,
};
