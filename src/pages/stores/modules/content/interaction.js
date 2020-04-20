const initialState = {
	data: ''
};

const mutations = {
	CONTENT_INTERACTION_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const contentInteraction = {
	state: { ...initialState },
	mutations,
};
