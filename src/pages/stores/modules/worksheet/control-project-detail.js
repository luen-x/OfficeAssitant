const initialState = {
	data: ''
};

const mutations = {
	WORKSHEET_CONTROL_PROJECT_DETAIL_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const worksheetControlProjectDetail = {
	state: { ...initialState },
	mutations,
};
