const initialState = {
	data: ''
};

const mutations = {
	FINANCE_MAIN_SCHEDULE_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const financeMainSchedule = {
	state: { ...initialState },
	mutations,
};
