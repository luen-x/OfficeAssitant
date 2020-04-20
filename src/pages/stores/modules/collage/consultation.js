const initialState = {
	data: ''
};

const mutations = {
	COLLAGE_CONSULTATION_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const collageConsultation = {
	state: { ...initialState },
	mutations,
};
