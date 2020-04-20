const initialState = {
	data: ''
};

const mutations = {
	HR_EMPLOYEE_DIMISSION_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const hrEmployeeDimission = {
	state: { ...initialState },
	mutations,
};
