const initialState = {
	data: ''
};

const mutations = {
	STATISTICS_CUSTOMER_EMPLOYEE_TYPE_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const statisticsCustomerEmployeeType = {
	state: { ...initialState },
	mutations,
};
