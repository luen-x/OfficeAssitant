const initialState = {
	data: ''
};

const mutations = {
	ACADEMY_TRAIN_PLAN_MANAGE_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const academyTrainPlanManage = {
	state: { ...initialState },
	mutations,
};
