const initialState = {
	data: ''
};

const mutations = {
	HR_EMPLOYEE_RELATION_TRY_INVOICE_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const hrEmployeeRelationTryInvoice = {
	state: { ...initialState },
	mutations,
};
