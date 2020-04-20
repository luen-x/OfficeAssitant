const initialState = {
	data: ''
};

const mutations = {
	SC_MANAGE_STATISTICS_DATA_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const scManageStatisticsData = {
	state: { ...initialState },
	mutations
};
