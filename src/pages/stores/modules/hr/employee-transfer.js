const initialState = {
	data: ''
};

const mutations = {
	HR_EMPLOYEE_TRANSFER_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const hrEmployeeTransfer = {
	state: { ...initialState },
	mutations,
};
