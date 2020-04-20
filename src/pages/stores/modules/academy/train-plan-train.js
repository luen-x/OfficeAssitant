const initialState = {
	data: ''
};

const mutations = {
	ACADEMY_TRAIN_PLAN_TRAIN_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const academyTrainPlanTrain = {
	state: { ...initialState },
	mutations,
};
