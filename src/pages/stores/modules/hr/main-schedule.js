const initialState = {
	data: {}
};

const mutations = {
	HR_MAIN_SCHEDULE_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const hrMainSchedule = {
	state: { ...initialState },
	mutations,
};
