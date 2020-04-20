import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
		count: [0, 0, 0],
		is_open_school_assign: false,
		applicant_arr: [],
		assign_type: 0, // 校招分配状态 0 未开启 1 随机分配 2 总监分配
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
		},
	},
};

const mutations = {
	HR_RECRUIT_SCHOOL_TRYASSIGN_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
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
			count: [data.await_assign_count, data.assigning_count, data.assign_count],
			is_open_school_assign: data.is_open_school_assign,
			applicant_arr: data.applicant_arr,
			assign_type: data.assign_type
		};
	},
	HR_RECRUIT_SCHOOL_TRYASSIGN_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			[type]: {
				...initPage,
				reset: true
			}
		};
	},
	HR_RECRUIT_SCHOOL_TRYASSIGN_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	HR_RECRUIT_SCHOOL_TRYASSIGN_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	HR_RECRUIT_SCHOOL_SUMMARY_ASSIGN_POST_SUCCESS(state, { type }) {
		state.listInfo = {
			...state.listInfo,
			'1': {
				...initPage,
				reset: true
			},
			'2': {
				...initPage,
			},
			'3': {
				...initPage,
			}
		};
	},
	HR_RECRUIT_SCHOOL_TRYASSIGN_TITLE_CHANGE(state, payload) { 
		state.title[payload.type].title_show = payload.title_show;
		state.title[payload.type].title_hide = payload.title_hide;
	},
	HR_RECRUIT_SCHOOL_TRYASSIGN_SELECTED_TAB(state, payload) {
		state.type = payload;
	},
};

export const hrRecruitSchoolTryassign = {
	state: { ...initialState },
	mutations,
};
