const initialState = {
	data: ''
};

const mutations = {
	SC_CUSTOMER_COOPERATE_LOOK_MAIL_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const scCustomerCooperateLookMail = {
	state: { ...initialState },
	mutations,
};
