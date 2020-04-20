const initialState = {
	data: ''
};

const mutations = {
	SALE_MAIN_SET_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const saleMainSet = {
	state: { ...initialState },
	mutations,
};
