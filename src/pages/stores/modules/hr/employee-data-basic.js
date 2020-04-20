const initialState = {
	data: ''
};

const mutations = {
	HR_EMPLOYEE_DATA_BASIC_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const hrEmployeeDataBasic = {
	state: { ...initialState },
	mutations,
};
