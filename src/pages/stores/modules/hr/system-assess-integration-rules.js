const initialState = {
	data: ''
};

const mutations = {
	HR_SYSTEM_ASSESS_INTEGRATION_RULES_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const hrSystemAssessIntegrationRules = {
	state: { ...initialState },
	mutations,
};
