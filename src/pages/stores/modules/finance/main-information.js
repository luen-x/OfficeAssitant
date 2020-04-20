const initialState = {
	data: ''
};

const mutations = {
	FINANCE_MAIN_INFORMATION_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const financeMainInformation = {
	state: { ...initialState },
	mutations,
};
