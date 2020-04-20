const initialState = {
	data: ''
};

const mutations = {
	FINANCE_COUNT_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const financeCount = {
	state: { ...initialState },
	mutations,
};
