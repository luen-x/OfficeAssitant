const initialState = {
	data: ''
};

const mutations = {
	COLLAGE_MAIN_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const collageMain = {
	state: { ...initialState },
	mutations,
};
