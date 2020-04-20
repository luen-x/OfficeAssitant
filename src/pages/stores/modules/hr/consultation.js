const initialState = {
	data: ''
};

const mutations = {
	HR_CONSULTATION_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const hrConsultation = {
	state: { ...initialState },
	mutations,
};
