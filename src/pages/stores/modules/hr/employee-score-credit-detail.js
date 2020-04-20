const initialState = {
	data: ''
};

const mutations = {
	HR_EMPLOYEE_SCORE_CREDIT_DETAIL_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const hrEmployeeScoreCreditDetail = {
	state: { ...initialState },
	mutations,
};
