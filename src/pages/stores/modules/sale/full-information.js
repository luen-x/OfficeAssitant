const initialState = {
	data: ''
};

const mutations = {
	SALE_FULL_INFORMATION_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const saleFullInformation = {
	state: { ...initialState },
	mutations,
};
