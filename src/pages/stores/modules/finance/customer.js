const initialState = {
	data: ''
};

const mutations = {
	FINANCE_CUSTOMER_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const financeCustomer = {
	state: { ...initialState },
	mutations,
};
