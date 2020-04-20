const initialState = {
	data: ''
};

const mutations = {
	HR_EMPLOYEE_SCORE_INTEGRATION_LEADIN_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const hrEmployeeScoreIntegrationLeadin = {
	state: { ...initialState },
	mutations,
};
