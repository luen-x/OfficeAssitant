const initialState = {
	data: ''
};

const mutations = {
	CONTENT_CIRCLE_ADD_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const contentCircleAdd = {
	state: { ...initialState },
	mutations,
};
