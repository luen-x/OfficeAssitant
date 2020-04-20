const initialState = {
	data: ''
};

const mutations = {
	SALE_CUSTOMER_INTENTION_ADD_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const saleCustomerIntentionAdd = {
	state: { ...initialState },
	mutations,
};
