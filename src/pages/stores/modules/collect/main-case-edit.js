const initialState = {
	data: ''
};

const mutations = {
	COLLECT_MAIN_CASE_EDIT_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const collectMainCaseEdit = {
	state: { ...initialState },
	mutations,
};
