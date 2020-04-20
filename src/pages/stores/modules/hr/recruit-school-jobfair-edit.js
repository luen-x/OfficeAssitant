const initialState = {
	data: ''
};

const mutations = {
	HR_RECRUIT_SCHOOL_JOBFAIR_EDIT_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const hrRecruitSchoolJobfairEdit = {
	state: { ...initialState },
	mutations,
};
