const initialState = {
	data: ''
};

const mutations = {
	HR_EMPLOYEE_DATA_COMMISSAR_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const hrEmployeeDataCommissar = {
	state: { ...initialState },
	mutations,
};
