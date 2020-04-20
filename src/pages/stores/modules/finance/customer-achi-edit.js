const initialState = {
	data: ''
};

const mutations = {
	FINANCE_CUSTOMER_ACHI_EDIT_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const financeCustomerAchiEdit = {
	state: { ...initialState },
	mutations,
};
