const initialState = {
	data: ''
};

const mutations = {
	HR_PERSONNEL_CURRENCY_REWARDS_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const hrPersonnelCurrencyRewards = {
	state: { ...initialState },
	mutations,
};
