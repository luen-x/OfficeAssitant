// import * as types from '@mutations/hr';

const initialState = {
	data: ''
};

const mutations = {
	HR_EMPLOYEE_SUMMARY_DETAILS_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const hrEmployeeSummaryDetails = {
	state: { ...initialState },
	mutations,
};
