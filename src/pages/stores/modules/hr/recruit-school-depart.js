import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
		count: [0, 0, 0, 0],
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
	}
};

const mutations = {
	HR_RECRUIT_SCHOOL_DEPART_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
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
			count: [data.assign_count, data.weed_out_count, data.departure_count, data.leave_count]
		};
	},
	HR_RECRUIT_SCHOOL_DEPART_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			[type]: {
				...initPage,
				reset: true
			}
		};
	},
	HR_RECRUIT_SCHOOL_DEPART_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	HR_RECRUIT_SCHOOL_DEPART_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	HR_RECRUIT_SCHOOL_SUMMARY_ASSIGN_POST_SUCCESS(state, { type }) {
		state.listInfo = {
			...state.listInfo,
			'1': {
				...initPage,
			},
			'2': {
				...initPage,
			},
			'3': {
				...initPage,
			},
			'4': {
				...initPage,
			}
		};
	}
};

export const hrRecruitSchoolDepart = {
	state: { ...initialState },
	mutations,
};
