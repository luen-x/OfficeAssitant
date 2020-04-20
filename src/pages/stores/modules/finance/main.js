const initialState = {
	data: ''
};

const mutations = {
	FINANCE_MAIN_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const financeMain = {
	state: { ...initialState },
	mutations,
};
