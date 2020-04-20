const initialState = {
	data: ''
};

const mutations = {
	ACADEMY_MAIN_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const academyMain = {
	state: { ...initialState },
	mutations,
};
