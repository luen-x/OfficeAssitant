import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
		list: [],
		isFetched: false
	}
};

const mutations = {
	HR_RECRUIT_SCHOOL_ASSIGNDETAILS_LIST_GET_SUCCESS(state, { data, param }) {
		state.listInfo = {
			...state.listInfo,
			list: data,
			isFetched: true
		};
	},
	HR_RECRUIT_SCHOOL_ASSIGNDETAILS_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			reset: true
		};
	},
	HR_RECRUIT_SCHOOL_ASSIGNDETAILS_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	HR_RECRUIT_SCHOOL_ASSIGNDETAILS_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
};

export const hrRecruitSchoolAssigndetails = {
	state: { ...initialState },
	mutations,
};
