const initialState = {
	data: ''
};

const mutations = {
	CONTENT_PROP_SET_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const contentPropSet = {
	state: { ...initialState },
	mutations,
};
