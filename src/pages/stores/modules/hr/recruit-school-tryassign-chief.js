const initialState = {
	data: ''
};

const mutations = {
	HR_RECRUIT_SCHOOL_TRYASSIGN_CHIEF_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const hrRecruitSchoolTryassignChief = {
	state: { ...initialState },
	mutations,
};
