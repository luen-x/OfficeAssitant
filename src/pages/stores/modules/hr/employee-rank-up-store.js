const initialState = {
	data: ''
};

const mutations = {
	HR_EMPLOYEE_RANK_UP_STORE_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const hrEmployeeRankUpStore = {
	state: { ...initialState },
	mutations,
};
