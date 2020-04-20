const initialState = {
	data: ''
};

const mutations = {
	SALE_SERVICE_CUSTOMER_DO_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const saleServiceCustomerDo = {
	state: { ...initialState },
	mutations,
};
