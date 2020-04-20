const initialState = {
	data: ''
};

const mutations = {
	WORKSHEET_CONTROL_PROJECT_ADD_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const worksheetControlProjectAdd = {
	state: { ...initialState },
	mutations,
};
