const initialState = {
	data: ''
};

const mutations = {
	COLLECT_MAIN_CASE_DETAIL_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const collectMainCaseDetail = {
	state: { ...initialState },
	mutations,
};
