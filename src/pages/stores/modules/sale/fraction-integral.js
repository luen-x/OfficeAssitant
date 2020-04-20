const initialState = {
	data: ''
};

const mutations = {
	SALE_FRACTION_INTEGRAL_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	},
	SALE_FRACTION_INTEGRAL_ROUTE_CHANGE(state, payload) {
		state.data = '';
	}
};

export const saleFractionIntegral = {
	state: { ...initialState },
	mutations,
};
