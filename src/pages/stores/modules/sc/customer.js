const initialState = {
	data: ''
};

const mutations = {
	SC_CUSTOMER_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const scCustomer = {
	state: { ...initialState },
	mutations,
};
