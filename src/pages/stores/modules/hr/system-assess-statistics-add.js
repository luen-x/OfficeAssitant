const initialState = {
	data: ''
};

const mutations = {
	HR_SYSTEM_ASSESS_STATISTICS_ADD_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const hrSystemAssessStatisticsAdd = {
	state: { ...initialState },
	mutations,
};
