const initialState = {
	data: ''
};

const mutations = {
	TECH_PROJECT_PLAN_DEMAND_ADD_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const techProjectPlanDemandAdd = {
	state: { ...initialState },
	mutations,
};
