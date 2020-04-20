const initialState = {
	data: ''
};

const mutations = {
	SALE_SEA_SETTING_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const saleSeaSetting = {
	state: { ...initialState },
	mutations,
};
