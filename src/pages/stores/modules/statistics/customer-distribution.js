const initialState = {
	data: ''
};

const mutations = {
	STATISTICS_CUSTOMER_DISTRIBUTION_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const statisticsCustomerDistribution = {
	state: { ...initialState },
	mutations,
};
