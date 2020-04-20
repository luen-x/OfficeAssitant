const initialState = {
	data: ''
};

const mutations = {
	SALE_CUSTOMER_INTENTION_DETAIL_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const saleCustomerIntentionDetail = {
	state: { ...initialState },
	mutations,
};
