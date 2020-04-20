const initialState = {
	data: ''
};

const mutations = {
	HR_EMPLOYEE_RELATION_LEAVE_INVOICE_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const hrEmployeeRelationLeaveInvoice = {
	state: { ...initialState },
	mutations,
};
