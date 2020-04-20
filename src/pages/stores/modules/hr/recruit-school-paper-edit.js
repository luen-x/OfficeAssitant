const initialState = {
	data: ''
};

const mutations = {
	HR_RECRUIT_SCHOOL_PAPER_EDIT_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const hrRecruitSchoolPaperEdit = {
	state: { ...initialState },
	mutations,
};
