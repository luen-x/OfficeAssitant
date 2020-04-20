const initialState = {
	data: ''
};

const mutations = {
	HR_SYSTEM_ASSESS_RANK_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const hrSystemAssessRank = {
	state: { ...initialState },
	mutations,
};
