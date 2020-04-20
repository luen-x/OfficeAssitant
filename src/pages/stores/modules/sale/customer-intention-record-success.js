const initialState = {
	data: ''
};

const mutations = {
	SALE_CUSTOMER_INTENTION_RECORD_SUCCESS_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const saleCustomerIntentionRecordSuccess = {
	state: { ...initialState },
	mutations,
};
