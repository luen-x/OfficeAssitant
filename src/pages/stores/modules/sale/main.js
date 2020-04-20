const initialState = {
	data: ''
};

const mutations = {
	SALE_MAIN_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const saleMain = {
	state: { ...initialState },
	mutations,
};
