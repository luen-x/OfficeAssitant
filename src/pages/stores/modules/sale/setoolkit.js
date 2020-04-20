const initialState = {
	data: ''
};

const mutations = {
	SALE_SETOOLKIT_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const saleSetoolkit = {
	state: { ...initialState },
	mutations,
};
