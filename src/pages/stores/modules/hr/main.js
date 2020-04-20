const initialState = {
	data: {}
};

const mutations = {
	HR_MAIN_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const hrMain = {
	state: { ...initialState },
	mutations,
};
