const initialState = {
	data: ''
};

const mutations = {
	STATISTICS_QUALITY_DATA_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const statisticsQualityData = {
	state: { ...initialState },
	mutations,
};
