// import * as types from '@mutations/hr';

const initialState = {
	data: ''
};

const mutations = {
	HR_EMPLOYEE_SUMMARY_RESUME_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const hrEmployeeSummaryResume = {
	state: { ...initialState },
	mutations,
};
