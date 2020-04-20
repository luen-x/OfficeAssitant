const initialState = {
	data: ''
};

const mutations = {
	HR_RECRUIT_SCHOOL_SUMMARY_EMAIL_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const hrRecruitSchoolSummaryEmail = {
	state: { ...initialState },
	mutations,
};
