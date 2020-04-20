const initialState = {
	data: ''
};

const mutations = {
	STATISTICS_DEAL_REFUND_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const statisticsDealRefund = {
	state: { ...initialState },
	mutations,
};
