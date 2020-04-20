const initialState = {
	data: ''
};

const mutations = {
	CONTENT_PRODUCT_NEW_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const contentProductNew = {
	state: { ...initialState },
	mutations,
};
