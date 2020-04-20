const initialState = {
	data: ''
};

const mutations = {
	SALE_CUSTOMER_DEAL_CONTRACT_ORDER_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const saleCustomerDealContractOrder = {
	state: { ...initialState },
	mutations,
};
