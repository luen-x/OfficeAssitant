const initialState = {
	data: ''
};

const mutations = {
	SALE_PROPERTY_CONTROL_ADD_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const salePropertyControlAdd = {
	state: { ...initialState },
	mutations,
};
