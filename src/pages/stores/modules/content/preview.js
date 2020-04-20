const initialState = {
	data: ''
};

const mutations = {
	CONTENT_PREVIEW_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const contentPreview = {
	state: { ...initialState },
	mutations,
};
