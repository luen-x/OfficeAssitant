const initialState = {
	data: ''
};

const mutations = {
	SALE_SATOOLKIT_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const saleSatoolkit = {
	state: { ...initialState },
	mutations,
};
