const initialState = {
	data: ''
};

const mutations = {
	WORKSHEET_CONTROL_BUG_DETAIL_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const worksheetControlBugDetail = {
	state: { ...initialState },
	mutations,
};
