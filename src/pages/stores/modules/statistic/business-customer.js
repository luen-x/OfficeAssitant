const initialState = {
	data: ''
};

const mutations = {
	STATISTIC_BUSINESS_CUSTOMER_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const statisticBusinessCustomer = {
	state: { ...initialState },
	mutations,
};
