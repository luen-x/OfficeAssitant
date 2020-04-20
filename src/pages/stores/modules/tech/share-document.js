const initialState = {
	data: ''
};

const mutations = {
	TECH_SHARE_DOCUMENT_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const techShareDocument = {
	state: { ...initialState },
	mutations,
};
