import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
		count: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
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
		'7': {
			...initPage
		},
		'8': {
			...initPage
		},
		'9': {
			...initPage
		},
		'10': {
			...initPage
		},
		'11': {
			...initPage
		},
		'12': {
			...initPage
		}
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
		},
		'8': {
			title_show: [],
			title_hide: []
		},
		'9': {
			title_show: [],
			title_hide: []
		},
		'10': {
			title_show: [],
			title_hide: []
		},
		'11': {
			title_show: [],
			title_hide: []
		},
		'12': {
			title_show: [],
			title_hide: []
		}
	}
};

const mutations = {
	HR_RECRUIT_SCHOOL_SUMMARY_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
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
			count: [data.count.all_count, data.count.default_count, data.count.initial_communication_count,
				data.count.await_interview_count, data.count.offer_count, data.count.replied_count,
				data.count.register_count, data.count.try_count, data.count.await_entry_count,
				data.count.entry_count, data.count.weed_out_count, data.count.departure_count,
				data.count.leave_count]
		};
	},
	HR_RECRUIT_SCHOOL_SUMMARY_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			[type]: {
				...initPage,
				reset: true
			}
		};
	},
	HR_RECRUIT_SCHOOL_SUMMARY_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	HR_RECRUIT_SCHOOL_SUMMARY_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	// 存放当前选中tab
	HR_RECRUIT_SCHOOL_SUMMARY_SELECTED_TAB(state, payload) {
		state.type = payload;
	},
	// 删除应聘者
	HR_RECRUIT_SCHOOL_DEL_POST_SUCCESS(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	// 添加备注成功
	_HR_RECRUIT_SCHOOL_SUMMARY_ADD_MSG_POST_SUCCESS(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	// 变更状态
	HR_RECRUIT_SCHOOL_CHANGE_POST_SUCCESS(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	// 淘汰应聘者
	HR_RECRUIT_SCHOOL_PASS_POST_SUCCESS(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	// 试岗指派
	HR_RECRUIT_SCHOOL_SUMMARY_ASSIGN_POST_SUCCESS(state, { type }) {
		state.listInfo = {
			...state.listInfo,
			'0': {
				...initPage,
				reset: true
			},
			'5': {
				...initPage,
			},
			'6': {
				...initPage,
			},
			'7': {
				...initPage,
			},
		};
	},
	// 恢复
	HR_RECRUIT_SCHOOL_SUMMARY_RECOVER_POST_SUCCESS(state, { type }) {
		state.listInfo = {
			...state.listInfo,
			'0': {
				...initPage,
				reset: true
			},
			'1': {
				...initPage,
			},
			'6': {
				...initPage,
			},
			'10': {
				...initPage,
			},
			'11': {
				...initPage,
			}
		};
	},
	HR_RECRUIT_SCHOOL_SUMMARY_TITLE_CHANGE(state, payload) {
		state.title[payload.type].title_show = payload.title_show;
		state.title[payload.type].title_hide = payload.title_hide;
	}
};

export const hrRecruitSchoolSummary = {
	state: { ...initialState },
	mutations,
};
