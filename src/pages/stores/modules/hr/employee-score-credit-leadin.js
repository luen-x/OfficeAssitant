const initialState = {
	data: ''
};

const mutations = {
	HR_EMPLOYEE_SCORE_CREDIT_LEADIN_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const hrEmployeeScoreCreditLeadin = {
	state: { ...initialState },
	mutations,
};
