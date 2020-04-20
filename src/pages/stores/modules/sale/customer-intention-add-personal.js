const initialState = {
	data: ''
};

const mutations = {
	SALE_CUSTOMER_INTENTION_ADD_PERSONAL_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const saleCustomerIntentionAddPersonal = {
	state: { ...initialState },
	mutations,
};
