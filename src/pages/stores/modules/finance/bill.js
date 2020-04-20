const initialState = {
	data: ''
};

const mutations = {
	FINANCE_BILL_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const financeBill = {
	state: { ...initialState },
	mutations,
};
