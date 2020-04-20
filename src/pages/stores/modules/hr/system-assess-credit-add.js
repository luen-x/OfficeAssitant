const initialState = {
	data: ''
};

const mutations = {
	HR_SYSTEM_ASSESS_CREDIT_ADD_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const hrSystemAssessCreditAdd = {
	state: { ...initialState },
	mutations,
};
