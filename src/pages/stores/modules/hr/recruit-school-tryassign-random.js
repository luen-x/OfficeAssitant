const initialState = {
	data: ''
};

const mutations = {
	HR_RECRUIT_SCHOOL_TRYASSIGN_RANDOM_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const hrRecruitSchoolTryassignRandom = {
	state: { ...initialState },
	mutations,
};
