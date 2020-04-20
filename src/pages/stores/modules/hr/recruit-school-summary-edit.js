const initialState = {
	data: ''
};

const mutations = {
	HR_RECRUIT_SCHOOL_SUMMARY_EDIT_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const hrRecruitSchoolSummaryEdit = {
	state: { ...initialState },
	mutations,
};
