const initialState = {
	data: ''
};

const mutations = {
	SALE_FRACTION_INTEGRAL_DETAIL_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const saleFractionIntegralDetail = {
	state: { ...initialState },
	mutations,
};
