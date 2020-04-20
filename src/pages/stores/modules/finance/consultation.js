const initialState = {
	data: ''
};

const mutations = {
	FINANCE_CONSULTATION_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const financeConsultation = {
	state: { ...initialState },
	mutations,
};
