const initialState = {
	data: ''
};

const mutations = {
	SALE_CUSTOMER_INTENTION_ADD_CONFIRM_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const saleCustomerIntentionAddConfirm = {
	state: { ...initialState },
	mutations,
};
