const initialState = {
	data: ''
};

const mutations = {
	STATISTICS_DEAL_SWITCH_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const statisticsDealSwitch = {
	state: { ...initialState },
	mutations,
};
