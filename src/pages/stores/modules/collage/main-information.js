const initialState = {
	data: ''
};

const mutations = {
	COLLAGE_MAIN_INFORMATION_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const collageMainInformation = {
	state: { ...initialState },
	mutations,
};
