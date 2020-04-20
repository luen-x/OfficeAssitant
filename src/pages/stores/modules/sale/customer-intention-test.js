const initialState = {
	data: ''
};

const mutations = {
	SALE_CUSTOMER_INTENTION_TEST_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const saleCustomerIntentionTest = {
	state: { ...initialState },
	mutations,
};
