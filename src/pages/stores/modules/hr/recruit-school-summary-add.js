const initialState = {
	data: ''
};

const mutations = {
	HR_RECRUIT_SCHOOL_SUMMARY_ADD_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const hrRecruitSchoolSummaryAdd = {
	state: { ...initialState },
	mutations,
};
