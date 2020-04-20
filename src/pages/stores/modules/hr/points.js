const initialState = {
	data: ''
};

const mutations = {
	HR_POINTS_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const hrPoints = {
	state: { ...initialState },
	mutations,
};
