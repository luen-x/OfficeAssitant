const initialState = {
	data: ''
};

const mutations = {
	HR_TOOL_MODULES_EDIT_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const hrToolModulesEdit = {
	state: { ...initialState },
	mutations,
};
