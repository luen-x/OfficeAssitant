const initialState = {
	data: ''
};

const mutations = {
	HR_SYSTEM_ASSESS_CREDIT_RULES_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const hrSystemAssessCreditRules = {
	state: { ...initialState },
	mutations,
};
