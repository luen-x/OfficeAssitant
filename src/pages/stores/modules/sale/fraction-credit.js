const initialState = {
	data: ''
};

const mutations = {
	SALE_FRACTION_CREDIT_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	},
	SALE_FRACTION_CREDIT_ROUTE_CHANGE(state, payload) {
		state.data = '';
	}
};

export const saleFractionCredit = {
	state: { ...initialState },
	mutations,
};
