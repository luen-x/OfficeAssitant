const initialState = {
	data: ''
};

const mutations = {
	HR_ACADEMY_TRAIN_DETAIL_PLAN_0_ACTIVITY_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const hrAcademyTrainDetailPlan0Activity = {
	state: { ...initialState },
	mutations,
};
