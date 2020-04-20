const initialState = {
	data: [],
};

const mutations = {
	CONTENT_SEARCH_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	},
	CONTENT_SEARCH_RELATION_LIST_GET_SUCCESS(state, payload) {
		state.data = {
			...payload
		};
	},
};

export const contentSearch = {
	state: { ...initialState },
	mutations,
};
