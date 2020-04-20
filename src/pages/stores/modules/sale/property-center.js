const initialState = {
	data: ''
};

const mutations = {
	SALE_PROPERTY_CENTER_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const salePropertyCenter = {
	state: { ...initialState },
	mutations,
};
