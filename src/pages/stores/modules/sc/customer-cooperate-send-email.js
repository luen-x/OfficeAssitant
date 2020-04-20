const initialState = {
	data: ''
};

const mutations = {
	SC_CUSTOMER_COOPERATE_SEND_EMAIL_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const scCustomerCooperateSendEmail = {
	state: { ...initialState },
	mutations,
};
