import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
		...initPage
	}
};

const mutations = {
	HR_RECRUIT_SCHOOL_SUMMARY_ELISTS_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
		state.listInfo = {
			...state.listInfo,
			total: data.totalCount,
			data: {
				...state.listInfo.data,
				[page]: data.list
			}
		};
	},
	HR_RECRUIT_SCHOOL_SUMMARY_ELISTS_LIST_RESET(state) {
		state.listInfo = {
			...initialState.listInfo,
			reset: true
		};
	},
	HR_RECRUIT_SCHOOL_SUMMARY_ELISTS_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	HR_RECRUIT_SCHOOL_SUMMARY_ELISTS_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
};

export const hrRecruitSchoolSummaryElists = {
	state: { ...initialState },
	mutations,
};
