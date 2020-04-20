const initialState = {
	data: ''
};

const mutations = {
	HR_ARCHIVES_EMPLOYEE_CUSTOMER_DETAIL_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const hrArchivesEmployeeCustomerDetail = {
	state: { ...initialState },
	mutations,
};
