const initialState = {
	data: ''
};

const mutations = {
	HR_SYSTEM_ASSESS_UP_ADD_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const hrSystemAssessUpAdd = {
	state: { ...initialState },
	mutations,
};
