const initialState = {
	data: ''
};

const mutations = {
	HR_RECRUIT_SCHOOL_PAPER_RESULT_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const hrRecruitSchoolPaperResult = {
	state: { ...initialState },
	mutations,
};
