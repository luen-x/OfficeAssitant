const initialState = {
	data: ''
};

const mutations = {
	HR_RECRUIT_SCHOOL_JOBFAIR_ADD_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const hrRecruitSchoolJobfairAdd = {
	state: { ...initialState },
	mutations,
};
