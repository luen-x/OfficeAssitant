const initialState = {
	data: ''
};

const mutations = {
	HR_RECRUIT_SCHOOL_ENTRY_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const hrRecruitSchoolEntry = {
	state: { ...initialState },
	mutations,
};
