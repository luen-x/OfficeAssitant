const initialState = {
	data: ''
};

const mutations = {
	ACADEMY_SUPPORT_CASE_ADD_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const academySupportCaseAdd = {
	state: { ...initialState },
	mutations,
};
