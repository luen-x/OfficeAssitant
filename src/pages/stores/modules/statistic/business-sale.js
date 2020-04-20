const initialState = {
	data: ''
};

const mutations = {
	STATISTIC_BUSINESS_SALE_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const statisticBusinessSale = {
	state: { ...initialState },
	mutations,
};
