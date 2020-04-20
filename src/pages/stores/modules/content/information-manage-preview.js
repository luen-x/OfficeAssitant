const initialState = {
	data: ''
};

const mutations = {
	CONTENT_INFORMATION_MANAGE_PREVIEW_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const contentInformationManagePreview = {
	state: { ...initialState },
	mutations,
};
