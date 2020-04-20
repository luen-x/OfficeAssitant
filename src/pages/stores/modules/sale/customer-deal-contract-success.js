const initialState = {
	data: ''
};

const mutations = {
	SALE_CUSTOMER_DEAL_CONTRACT_SUCCESS_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const saleCustomerDealContractSuccess = {
	state: { ...initialState },
	mutations,
};
