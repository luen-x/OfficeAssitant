const initialState = {
	data: ''
};

const mutations = {
	SALE_FRACTION_CREDIT_DETAIL_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const saleFractionCreditDetail = {
	state: { ...initialState },
	mutations,
};
