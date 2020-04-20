const initialState = {
	data: ''
};

const mutations = {
	HR_ACADEMY_ELITE_ADD_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const hrAcademyEliteAdd = {
	state: { ...initialState },
	mutations,
};
