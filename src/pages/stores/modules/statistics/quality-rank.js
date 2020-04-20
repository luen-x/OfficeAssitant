const initialState = {
	data: ''
};

const mutations = {
	STATISTICS_QUALITY_RANK_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const statisticsQualityRank = {
	state: { ...initialState },
	mutations,
};
