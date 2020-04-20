import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
		count: [0, 0, 0, 0, 0, 0, 0],
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
		'5': {
			...initPage
		},
		'6': {
			...initPage
		},
	},
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
		'5': {
			title_show: [],
			title_hide: []
		},
		'6': {
			title_show: [],
			title_hide: []
		},
	}
};

const mutations = {
	HR_RECRUIT_SOCIAL_TALENT_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
		state.listInfo = {
			...state.listInfo,
			count: [
				data.all_count, 
				data.un_interview_count,
				data.paper_pass_count,
				data.interviewed_count,
				data.un_receieved_offer_count,
				data.trying_count,
				data.tryed_count
			],
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
	HR_RECRUIT_SOCIAL_TALENT_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			[type]: {
				...initPage,
				reset: true
			}
		};
	},
	HR_RECRUIT_APPLICANT_DEL_POST_SUCCESS(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	HR_RECRUIT_APPLICANT_RECOVER_POST_SUCCESS(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	HR_RECRUIT_SOCIAL_TALENT_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	HR_RECRUIT_SOCIAL_TALENT_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	// 存放当前选中tab
	HR_RECRUIT_SOCIAL_TALENT_SELECTED_TAB(state, payload) {
		state.type = payload;
	},
	HR_RECRUIT_SOCIAL_TALENT_TITLE_CHANGE(state, payload) {
		state.title[payload.type].title_show = payload.title_show;
		state.title[payload.type].title_hide = payload.title_hide;
	}
};

export const hrRecruitSocialTalent = {
	state: { ...initialState },
	mutations,
};
