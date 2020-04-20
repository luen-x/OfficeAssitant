const initialState = {
	data: ''
};

const mutations = {
	SC_CONSULTATION_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const scConsultation = {
	state: { ...initialState },
	mutations,
};