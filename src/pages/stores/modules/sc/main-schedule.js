const initialState = {
	data: {}
};

const mutations = {
	SC_MAIN_SCHEDULE_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const scMainSchedule = {
	state: { ...initialState },
	mutations,
};
