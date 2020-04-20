const initialState = {
	data: ''
};

const mutations = {
	SALE_PROPERTY_COIN_POLICY_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const salePropertyCoinPolicy = {
	state: { ...initialState },
	mutations,
};
