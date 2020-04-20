const initialState = {
	data: ''
};

const mutations = {
	TECH_PROJECT_PUBLISH_DOCUMENT_ADD_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const techProjectPublishDocumentAdd = {
	state: { ...initialState },
	mutations,
};
