const initialState = {
	data: ''
};

const mutations = {
	HR_FORM_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const hrForm = {
	state: { ...initialState },
	mutations,
};
