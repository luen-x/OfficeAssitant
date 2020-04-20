const initialState = {
	data: ''
};

const mutations = {
	SC_SERVICE_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const scService = {
	state: { ...initialState },
	mutations,
};
