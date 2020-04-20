const initialState = {
	data: ''
};

const mutations = {
	ACADEMY_TRAIN_PLAN_DETAIL_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const academyTrainPlanDetail = {
	state: { ...initialState },
	mutations,
};
