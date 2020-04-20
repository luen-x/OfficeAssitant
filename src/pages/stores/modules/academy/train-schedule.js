const initialState = {
	data: ''
};

const mutations = {
	ACADEMY_TRAIN_SCHEDULE_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const academyTrainSchedule = {
	state: { ...initialState },
	mutations,
};
