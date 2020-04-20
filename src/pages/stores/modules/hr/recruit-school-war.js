import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
		count: [0, 0],
		'1': {
			...initPage
		},
		'2': {
			...initPage
		}
	}
};

const mutations = {
	HR_RECRUIT_SCHOOL_WAR_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
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
			count: [data.await_assign_count, data.assign_count]
		};
	},
	HR_RECRUIT_SCHOOL_WAR_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			[type]: {
				...initPage,
				reset: true
			}
		};
	},
	HR_RECRUIT_SCHOOL_WAR_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	HR_RECRUIT_SCHOOL_WAR_ROUTE_CHANGE(state, payload) {
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
			}
		};
	}
};

export const hrRecruitSchoolWar = {
	state: { ...initialState },
	mutations,
};
