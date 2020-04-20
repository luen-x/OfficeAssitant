const initialState = {
	data: ''
};

const mutations = {
	SC_MAIN_INFORMATION_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const scMainInformation = {
	state: { ...initialState },
	mutations,
};
