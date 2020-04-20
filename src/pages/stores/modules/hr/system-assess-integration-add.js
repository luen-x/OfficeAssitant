const initialState = {
	data: ''
};

const mutations = {
	HR_SYSTEM_ASSESS_INTEGRATION_ADD_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const hrSystemAssessIntegrationAdd = {
	state: { ...initialState },
	mutations,
};
