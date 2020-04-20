const initialState = {
	data: ''
};

const mutations = {
	HR_EMPLOYEE_SCORE_INTEGRATION_DETAIL_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const hrEmployeeScoreIntegrationDetail = {
	state: { ...initialState },
	mutations,
};
