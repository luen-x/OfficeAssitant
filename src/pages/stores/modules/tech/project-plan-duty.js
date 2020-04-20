const initialState = {
	data: ''
};

const mutations = {
	TECH_PROJECT_PLAN_DUTY_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const techProjectPlanDuty = {
	state: { ...initialState },
	mutations,
};
