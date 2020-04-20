const initialState = {
	data: ''
};

const mutations = {
	COLLAGE_CHECK_STATISTIC_DATA_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const collageCheckStatisticData = {
	state: { ...initialState },
	mutations,
};
