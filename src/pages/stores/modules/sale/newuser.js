const initialState = {
	data: ''
};

const mutations = {
	SALE_NEWUSER_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const saleNewuser = {
	state: { ...initialState },
	mutations,
};
