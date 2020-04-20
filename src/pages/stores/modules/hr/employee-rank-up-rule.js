const initialState = {
	data: ''
};

const mutations = {
	HR_EMPLOYEE_RANK_UP_RULE_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const hrEmployeeRankUpRule = {
	state: { ...initialState },
	mutations,
};
