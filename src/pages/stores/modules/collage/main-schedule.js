const initialState = {
	data: ''
};

const mutations = {
	COLLAGE_MAIN_SCHEDULE_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const collageMainSchedule = {
	state: { ...initialState },
	mutations,
};
