import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
		count: [0, 0, 0, 0, 0, 0, 0, 0, 0],
		'0': {
			...initPage
		},
		'1': {
			...initPage
		},
		'8': {
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
		'7': {
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
		'8': {
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
		'7': {
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
	HR_RECRUIT_SOCIAL_SUMMARY_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
		state.listInfo = {
			...state.listInfo,
			count: [
				data.all_count,
				data.new_applicant_count,
				data.plan_to_interview_count,
				data.arrange_interview_count,
				data.offer_count,
				data.try_count,
				data.await_entry_count,
				data.entry_count,
				data.leave_count
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
	HR_RECRUIT_SOCIAL_SUMMARY_BATCH_DISUSE_POST_SUCCESS(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	HR_RECRUIT_SOCIAL_SUMMARY_CHANGE_POST_SUCCESS(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			'0': {
				...initPage,
				reset: true
			},
		};
	},
	HR_RECRUIT_SOCIAL_SUMMARY_EDIT_DESIGNATE_POST_SUCCESS(state, { type }) {
		state.listInfo = {
			...state.listInfo,
			'0': {
				...initPage,
				reset: true
			},
			'2': {
				...initPage,
				reset: true
			},
		};
	},
	HR_RECRUIT_SOCIAL_SUMMARY_KEEP_INTERVIEW_POST_SUCCESS(state, { type }) {
		state.listInfo = {
			...state.listInfo,
			'0': {
				...initPage,
				reset: true
			},
			'2': {
				...initPage,
				reset: true
			},
		};
	},
	HR_RECRUIT_SOCIAL_SUMMARY_DESIGNATE_POST_SUCCESS(state, { type }) {
		state.listInfo = {
			...state.listInfo,
			'0': {
				...initPage,
				reset: true
			},
			'4': {
				...initPage,
			},
		};
	},
	HR_RECRUIT_SOCIAL_SUMMARY_EXPECT_INTERVIEW_POST_SUCCESS(state, { type }) {
		state.listInfo = {
			...state.listInfo,
			'0': {
				...initPage,
				reset: true
			},
			'8': {
				...initPage,
			},
		};
	},
	HR_RECRUIT_APPLICANT_DEL_POST_SUCCESS(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	HR_RECRUIT_SOCIAL_SUMMARY_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	HR_RECRUIT_SOCIAL_SUMMARY_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	HR_RECRUIT_SOCIAL_SUMMARY_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	// 添加备注成功
	_HR_RECRUIT_ADD_REMARKS_POST_SUCCESS(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	HR_RECRUIT_SOCIAL_SUMMARY_TITLE_CHANGE(state, payload) {
		state.title[payload.type].title_show = payload.title_show;
		state.title[payload.type].title_hide = payload.title_hide;
	},
	HR_RECRUIT_SOCIAL_SUMMARY_SELECTED_TAB(state, payload) {
		state.type = payload;
	},
	HR_RECRUIT_SOCIAL_SUMMARY_LIST_SORT(state, payload) {
		state.sortData = payload;
	},
	HR_RECRUIT_SOCIAL_SUMMARY_LIST_SEARCH(state, payload) {
		state.searchData.title_show = payload.title_show;
		state.searchData.title_hide = payload.title_hide;
	}
};

export const hrRecruitSocialSummary = {
	state: { ...initialState },
	mutations,
};
