const initialState = {
	data: ''
};

const mutations = {
	WORKSHEET_CONTROL_BUG_ADD_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const worksheetControlBugAdd = {
	state: { ...initialState },
	mutations,
};
