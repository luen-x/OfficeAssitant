const initialState = {
	data: ''
};

const mutations = {
	HR_EMPLOYEE_DATA_EMDATA_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const hrEmployeeDataEmdata = {
	state: { ...initialState },
	mutations,
};
